package com.api.payglobal.service.bono;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.payglobal.dto.response.UsuarioEnRedResponse;
import com.api.payglobal.entity.Bono;
import com.api.payglobal.entity.Licencia;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.Wallet;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoBono;
import com.api.payglobal.entity.enums.TipoConceptos;
import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoMetodoPago;
import com.api.payglobal.entity.enums.TipoRango;
import com.api.payglobal.entity.enums.TipoWallets;
import com.api.payglobal.helpers.UninivelHelper;
import com.api.payglobal.repository.BonoRepository;
import com.api.payglobal.repository.LicenciaRepository;
import com.api.payglobal.repository.UsuarioRepository;
import com.api.payglobal.repository.WalletRepository;
import com.api.payglobal.service.transaccion.TransaccionService;

@Service
public class BonoServiceImpl implements BonoService {

    private final Double BONO_INSCRIPCION_NIVEL_1 = 0.07;
    private final Double BONO_INSCRIPCION_NIVEL_2 = 0.03;
    private final Double BONO_RENOVACION = 0.05;

    private final Double[] BONO_UNINIVEL = { 0.10, 0.06, 0.03, 0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03 };

    @Autowired
    private UninivelHelper uninivelHelper;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TransaccionService transaccionService;

    @Autowired
    private BonoRepository bonoRepository;

    @Override
    @Transactional
    public void bonoInscripcion(TipoLicencia tipoLicencia, String usernameReferido) throws Exception {
        List<UsuarioEnRedResponse> redInversa = uninivelHelper.obtenerRedDeUsuariosInversaRecursiva(usernameReferido, 0,
                2);

        for (UsuarioEnRedResponse usuarioEnRed : redInversa) {
            Double bono = 0.0;
            if (usuarioEnRed.getNivel() == 1) {
                bono = tipoLicencia.getValor() * BONO_INSCRIPCION_NIVEL_1;
            } else if (usuarioEnRed.getNivel() == 2) {
                bono = tipoLicencia.getValor() * BONO_INSCRIPCION_NIVEL_2;
            }

            final Double bonoFinal = bono;
            if (bonoFinal > 0) {
                Wallet wallet = walletRepository.findByUsuario_Username(usuarioEnRed.getUsername()).stream()
                        .filter(w -> w.getTipo().equals(TipoWallets.WALLET_COMISIONES))
                        .findFirst()
                        .orElse(null);

                if (wallet != null) {
                    wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bonoFinal)));
                    walletRepository.save(wallet);

                    TipoConceptos concepto = usuarioEnRed.getNivel() == 1
                            ? TipoConceptos.BONO_REGISTRO_DIRECTO
                            : TipoConceptos.BONO_REGISTRO_INDIRECTO;

                    Bono nuevoBono = CrearOActualizarBono(usuarioEnRed.getUsername(),TipoBono.BONO_INSCRIPCION, bonoFinal);
                    bonoRepository.save(nuevoBono);

                    String descripcion= "Bono de inscripción por " + (usuarioEnRed.getNivel() == 1 ? "registro directo" : "registro indirecto") +
                            " de usuario: " + usernameReferido;

                    registrarTransaccion(usuarioEnRed.getUsername(), bonoFinal, concepto,
                            TipoMetodoPago.WALLET_COMISIONES, descripcion);
                }
            }
        }

    }

    @Override
    public void bonoRenovacion(TipoLicencia tipoLicencia, String usernameReferido) throws Exception {
        List<Wallet> wallets = walletRepository.findByUsuario_Username(usernameReferido);

        Double bono = tipoLicencia.getValor() * BONO_RENOVACION;

        Wallet wallet = wallets.stream()
                .filter(w -> w.getTipo().equals(TipoWallets.WALLET_COMISIONES))
                .findFirst()
                .orElse(null);

        if (wallet != null) {
            wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bono)));
            walletRepository.save(wallet);

            Bono nuevoBono = CrearOActualizarBono(usernameReferido,TipoBono.BONO_REONOVACION_LICENCIA, bono);
            bonoRepository.save(nuevoBono);

            registrarTransaccion(usernameReferido, bono, TipoConceptos.BONO_REONOVACION_LICENCIA,
                    TipoMetodoPago.WALLET_COMISIONES, null);
        }

    }

    @Override
    @Transactional
    public Wallet bonoRango(Wallet wallet, String usernameReferido) throws Exception {
        return null;
    }

    @Override
    @Transactional
    public void ingresoPasivo() throws Exception {
        licenciaRepository.findByActivoTrue().forEach(licencia -> {
            try {
                Wallet wallet = walletRepository.findByUsuario_Username(licencia.getUsuario().getUsername()).stream()
                        .filter(w -> w.getTipo().equals(TipoWallets.WALLET_DIVIDENDOS))
                        .findFirst()
                        .orElseThrow(() -> new Exception("Wallet de comisiones no encontrada para el usuario: "
                                + licencia.getUsuario().getUsername()));

                Double ingresoPasivo = licencia.getPrecio() * 0.005; // 0.5% de ingreso pasivo diario
                BigDecimal nuevoSaldo = wallet.getSaldo().add(BigDecimal.valueOf(ingresoPasivo));

                // Actualizar saldoAcumulado en la licencia
                Integer saldoActual = licencia.getSaldoAcumulado() != null ? licencia.getSaldoAcumulado() : 0;
                licencia.setSaldoAcumulado(saldoActual + ingresoPasivo.intValue());

                if (nuevoSaldo.compareTo(BigDecimal.valueOf(licencia.getLimite())) >= 0) {
                    licencia.setActivo(false);
                    BigDecimal diferencia = nuevoSaldo.subtract(BigDecimal.valueOf(licencia.getPrecio()));
                    wallet.setSaldo(wallet.getSaldo().add(diferencia));
                    licenciaRepository.save(licencia);
                    walletRepository.save(wallet);

                    registrarTransaccion(licencia.getUsuario().getUsername(), ingresoPasivo,
                            TipoConceptos.INGRESO_PASIVO, TipoMetodoPago.WALLET_DIVIDENDOS, null);
                    return;
                }

                wallet.setSaldo(nuevoSaldo);
                Licencia nuevaLicencia = licenciaRepository.save(licencia);
                walletRepository.save(wallet);

                registrarTransaccion(nuevaLicencia.getUsuario().getUsername(), ingresoPasivo,
                        TipoConceptos.INGRESO_PASIVO,
                        TipoMetodoPago.WALLET_DIVIDENDOS, null);

                bonoUninivel(nuevaLicencia.getUsuario().getUsername(), ingresoPasivo,
                        nuevaLicencia.getUsuario().getRango());

            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    @Transactional
    public void bonoUninivel(String usernameReferido, Double monto, TipoRango tipoRango) throws Exception {
        List<UsuarioEnRedResponse> redInversa = uninivelHelper.obtenerRedDeUsuariosInversaRecursiva(usernameReferido, 0,
                tipoRango.getNumero());

        for (UsuarioEnRedResponse usuarioEnRed : redInversa) {
            int nivel = usuarioEnRed.getNivel();
            if (nivel <= BONO_UNINIVEL.length) {
                Double porcentajeBono = BONO_UNINIVEL[nivel];
                Double bono = monto * porcentajeBono;

                final Double bonoFinal = bono;
                if (bonoFinal > 0) {
                    // Actualizar wallet de comisiones
                    Wallet wallet = walletRepository.findByUsuario_Username(usuarioEnRed.getUsername()).stream()
                            .filter(w -> w.getTipo().equals(TipoWallets.WALLET_COMISIONES))
                            .findFirst()
                            .orElse(null);

                    if (wallet != null) {
                        wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bonoFinal)));
                        walletRepository.save(wallet);

                        registrarTransaccion(usuarioEnRed.getUsername(), bonoFinal, TipoConceptos.BONO_UNINIVEL,
                                TipoMetodoPago.WALLET_COMISIONES, usernameReferido);
                    }

                    // Actualizar saldoAcumulado en la licencia del usuario que recibe el bono
                    usuarioRepository.findByUsername(usuarioEnRed.getUsername()).ifPresent(usuario -> {
                        if (usuario.getLicencia() != null) {
                            Integer saldoActual = usuario.getLicencia().getSaldoAcumulado() != null
                                    ? usuario.getLicencia().getSaldoAcumulado()
                                    : 0;
                            usuario.getLicencia().setSaldoAcumulado(saldoActual + bonoFinal.intValue());
                            licenciaRepository.save(usuario.getLicencia());
                        }
                    });
                }
            }
        }
    }

    @Override
    @Transactional
    public void asignacionRango() throws Exception {
        usuarioRepository.findAll().forEach(usuario -> {
            try {

                List<Usuario> redDeUsuario = uninivelHelper.obtenerRedDeUsuario(usuario.getUsername());

                BigDecimal totalPrecioLicencias = redDeUsuario.stream()
                        .map(u -> u.getLicencia())
                        .map(licencia -> BigDecimal.valueOf(licencia.getPrecio()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                TipoRango nuevoRango = TipoRango.RANGO_0;
                for (TipoRango rango : TipoRango.values()) {
                    if (totalPrecioLicencias.compareTo(BigDecimal.valueOf(rango.getCapitalNecesario())) >= 0) {
                        nuevoRango = rango;
                    } else {
                        break;
                    }
                }

                usuario.setRango(nuevoRango);
                usuarioRepository.save(usuario);

            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    private void registrarTransaccion(String username, Double monto, TipoConceptos concepto,
            TipoMetodoPago metodoPago, String descripcion) throws Exception {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("Usuario no encontrado con username: " + username));

        transaccionService.procesarTransaccion(
                usuario.getId(),
                monto,
                concepto,
                metodoPago,
                EstadoOperacion.COMPLETADA,
                null,
                descripcion);
    }

    private Bono CrearOActualizarBono(String username, TipoBono tipoBono, Double monto) {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Bono bono = usuario.getBonos().stream()
                .filter(b -> b.getNombre().equals(tipoBono))
                .findFirst()
                .map(b -> {
                    b.setAcumulado(b.getAcumulado().add(BigDecimal.valueOf(monto)));
                    return b;
                })
                .orElseGet(() -> {
                    Bono nuevoBono = Bono.builder()
                            .acumulado(BigDecimal.valueOf(monto))
                            .nombre(tipoBono)
                            .usuario(usuario)
                            .build();
                    return nuevoBono;
                });

        return bono;
    }
}
