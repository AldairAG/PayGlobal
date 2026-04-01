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

    private final Double BONO_INSCRIPCION_NIVEL_1 = 0.1;
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

        Usuario usuarioReferido = usuarioRepository.findByUsername(usernameReferido)
                .orElseThrow(() -> new Exception("Usuario no encontrado con username: " + usernameReferido));

        List<UsuarioEnRedResponse> redInversa = uninivelHelper.obtenerRedDeUsuariosInversaRecursiva(usernameReferido, 0,
                1);

        for (UsuarioEnRedResponse usuarioEnRed : redInversa) {
            if (usuarioEnRed.getNivel() == 1) {
                Double diferencia = (usuarioReferido.getLicencia() == null || usuarioReferido.getLicencia().getPrecio() <= 0) 
                    ? tipoLicencia.getValor() 
                    : tipoLicencia.getValor() - usuarioReferido.getLicencia().getPrecio().doubleValue();
                Double bono = diferencia * BONO_INSCRIPCION_NIVEL_1;

                // Validar que el usuario tenga licencia activa y no haya superado el límite
                if (!validarLicencia(usuarioEnRed.getUsername(), bono)) {
                    continue;
                }

                Wallet wallet = walletRepository.findByUsuario_Username(usuarioEnRed.getUsername()).stream()
                        .filter(w -> w.getTipo().equals(TipoWallets.WALLET_NETWORK))
                        .findFirst()
                        .orElse(null);

                if (wallet != null) {
                    wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bono)));
                    walletRepository.save(wallet);

                    Bono nuevoBono = crearOActualizarBono(usuarioEnRed.getUsername(), TipoBono.BONO_INSCRIPCION,
                            bono);
                    bonoRepository.save(nuevoBono);
                    
                    String descripcion = "Bono de inscripción por registro directo de usuario: " + usernameReferido;

                    aumentarSaldoAcumuladoLicencia(usuarioEnRed.getUsername(), bono);

                    registrarTransaccion(usuarioEnRed.getUsername(), bono, TipoConceptos.BONO_REGISTRO_DIRECTO,
                            TipoMetodoPago.WALLET_COMISIONES, descripcion);
                }
            }
        }

    }

    @Override
    public void bonoRenovacion(TipoLicencia tipoLicencia, String usernameReferido) throws Exception {
        List<Wallet> wallets = walletRepository.findByUsuario_Username(usernameReferido);

        Double bono = tipoLicencia.getValor() * BONO_RENOVACION;

        // Validar que el usuario tenga licencia activa y no haya superado el límite
        if (validarLicencia(usernameReferido, bono)) {
            return;
        }

        Wallet wallet = wallets.stream()
                .filter(w -> w.getTipo().equals(TipoWallets.WALLET_NETWORK))
                .findFirst()
                .orElse(null);

        if (wallet != null) {
            wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bono)));
            walletRepository.save(wallet);

            Bono nuevoBono = crearOActualizarBono(usernameReferido, TipoBono.BONO_REONOVACION_LICENCIA, bono);
            bonoRepository.save(nuevoBono);

            aumentarSaldoAcumuladoLicencia(usernameReferido, bono);

            registrarTransaccion(usernameReferido, bono, TipoConceptos.BONO_REONOVACION_LICENCIA,
                    TipoMetodoPago.WALLET_COMISIONES, null);
        }

    }

    @Override
    @Transactional
    public void bonoRango(String usernameReferido) throws Exception {

        Usuario usuario = usuarioRepository.findByUsername(usernameReferido)
                .orElseThrow(() -> new Exception("Usuario no encontrado con username: " + usernameReferido));

        //Obtener el volumen de la red del usuario

        Integer volumenRed = obtenerVolumenRed(usernameReferido);

        //Obtener el rango actual del usuario

        TipoRango rangoActual = usuario.getRango();

        //Determinar el nuevo rango del usuario

        if(volumenRed >rangoActual.getCapitalNecesario()){
            usuario.setRango(determinarRangoPorVolumen(volumenRed));
        }

        //Calcular el bono por rango

        if(usuario.getRango().getNumero() > rangoActual.getNumero()) {
            Double bono = usuario.getRango().getBono(); 
            Wallet wallet = walletRepository.findByUsuario_Username(usernameReferido).stream()
                    .filter(w -> w.getTipo().equals(TipoWallets.WALLET_NETWORK))
                    .findFirst()
                    .orElse(null);
            wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bono)));
            walletRepository.save(wallet);

            registrarTransaccion(usernameReferido, bono, TipoConceptos.BONO_RANGO,
                    null, null);
        }

        //Guardar cambios
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void ingresoPasivo() throws Exception {
        licenciaRepository.findByActivoTrue().forEach(licencia -> {
            try {
                Wallet wallet = walletRepository.findByUsuario_Username(licencia.getUsuario().getUsername()).stream()
                        .filter(w -> w.getTipo().equals(TipoWallets.WALLET_STAKING))
                        .findFirst()
                        .orElseThrow(() -> new Exception("Wallet de staking no encontrada para el usuario: "
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
        if(tipoRango == null || tipoRango.getNumero() <= 0) {
            return;
        }

        List<UsuarioEnRedResponse> redInversa = uninivelHelper.obtenerRedDeUsuariosInversaRecursiva(usernameReferido, 0,
                tipoRango.getNumero());

        for (UsuarioEnRedResponse usuarioEnRed : redInversa) {
            int nivel = usuarioEnRed.getNivel();
            if (nivel <= BONO_UNINIVEL.length) {
                Double porcentajeBono = BONO_UNINIVEL[nivel];
                Double bono = monto * porcentajeBono;

                final Double bonoFinal = bono;
                if (bonoFinal > 0) {
                    // Validar que el usuario tenga licencia activa y no haya superado el límite
                    if (!validarLicencia(usuarioEnRed.getUsername(), bonoFinal)) {
                        continue;
                    }

                    // Actualizar wallet de comisiones
                    Wallet wallet = walletRepository.findByUsuario_Username(usuarioEnRed.getUsername()).stream()
                            .filter(w -> w.getTipo().equals(TipoWallets.WALLET_NETWORK))
                            .findFirst()
                            .orElse(null);

                    if (wallet != null) {
                        wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bonoFinal)));
                        walletRepository.save(wallet);

                        registrarTransaccion(usuarioEnRed.getUsername(), bonoFinal, TipoConceptos.BONO_UNINIVEL,
                                TipoMetodoPago.WALLET_COMISIONES, usernameReferido);
                    }

                    // Actualizar saldoAcumulado en la licencia del usuario que recibe el bono
                    aumentarSaldoAcumuladoLicencia(usuarioEnRed.getUsername(), bonoFinal);
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

                TipoRango nuevoRango = TipoRango.SIN_RANGO;
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

    private Bono crearOActualizarBono(String username, TipoBono tipoBono, Double monto) {

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

    private void aumentarSaldoAcumuladoLicencia(String username, Double monto) {
        usuarioRepository.findByUsername(username).ifPresent(usuario -> {
            if (usuario.getLicencia() != null) {
                Integer saldoActual = usuario.getLicencia().getSaldoAcumulado() != null
                        ? usuario.getLicencia().getSaldoAcumulado()
                        : 0;
                usuario.getLicencia().setSaldoAcumulado(saldoActual + monto.intValue());
                licenciaRepository.save(usuario.getLicencia());
            }
        });
    }

    /**
     * Este metodo valida si el ususario puede recibir el bono, es decir, si tiene una licencia activa o no, y si el bono que se le va a asignar no supera el limite de la licencia
     * si el bono supera el limite de la licencia, se asigna el bono hasta el limite y se desactiva la licencia, si el bono no supera el limite, se asigna el bono normalmente
     * @param username el username del usuario a validar
     * @return true si el usuario puede recibir el bono, false en caso contrario
     */
    private Boolean validarLicencia(String username, Double monto) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getLicencia() == null || usuario.getLicencia().getPrecio() <= 0) {
            return false;
        }

        Integer saldoAcumulado = usuario.getLicencia().getSaldoAcumulado() != null
                ? usuario.getLicencia().getSaldoAcumulado()
                : 0;

        if (saldoAcumulado + monto > usuario.getLicencia().getPrecio()) {
            usuario.getLicencia().setSaldoAcumulado(usuario.getLicencia().getPrecio());
            usuario.getLicencia().setActivo(false);
            licenciaRepository.save(usuario.getLicencia());
            return false;
        }

        return true;
    }

    /**
     * Obtiene la suma de todas las licencias de el total de la red de un usuario hasta el nivel 10
     * @param username
     * @return volumen total de la red del usuario, es decir, la suma de todas las licencias de su red
     */
    private Integer obtenerVolumenRed(String username) {
        List<Usuario> redDeUsuario = uninivelHelper.obtenerRedDeUsuario(username);

        Integer volumenTotal = redDeUsuario.stream()
                .map(u -> u.getLicencia())
                .filter(licencia -> licencia != null)
                .map(licencia -> licencia.getPrecio())
                .reduce(0, Integer::sum);

        return volumenTotal;
    }

    private TipoRango determinarRangoPorVolumen(Integer volumen) {
        for (TipoRango rango : TipoRango.values()) {
            if (volumen >= rango.getCapitalNecesario()) {
                return rango;
            }
        }
        return TipoRango.SIN_RANGO;
    }

    @Override
    @Transactional
    public void bonoAuto() throws Exception {
        // Buscar usuarios con rango superior a TRIPLE_DIAMOND (numero > 5)
        List<Usuario> usuariosConBonoAuto = usuarioRepository.findAll().stream()
                .filter(usuario -> usuario.getRango() != null)
                .filter(usuario -> usuario.getRango().getNumero() > TipoRango.TRIPLE_DIAMOND.getNumero())
                .filter(usuario -> usuario.getRango().getBonoAuto() != null)
                .toList();

        for (Usuario usuario : usuariosConBonoAuto) {
            Integer bonoAuto = usuario.getRango().getBonoAuto();
            
            // Buscar wallet de comisiones del usuario
            Wallet wallet = walletRepository.findByUsuario_Username(usuario.getUsername()).stream()
                    .filter(w -> w.getTipo().equals(TipoWallets.WALLET_NETWORK))
                    .findFirst()
                    .orElse(null);

            if (wallet != null) {
                // Agregar el bono al wallet
                wallet.setSaldo(wallet.getSaldo().add(BigDecimal.valueOf(bonoAuto)));
                walletRepository.save(wallet);

                // Registrar transacción
                String descripcion = "Bono de auto por rango " + usuario.getRango().getNombre();
                registrarTransaccion(usuario.getUsername(), bonoAuto.doubleValue(), 
                        TipoConceptos.BONO_AUTO, TipoMetodoPago.WALLET_COMISIONES, descripcion);

                crearOActualizarBono(usuario.getUsername(), TipoBono.BONO_AUTO, bonoAuto.doubleValue());
            }
        }
    }

}

