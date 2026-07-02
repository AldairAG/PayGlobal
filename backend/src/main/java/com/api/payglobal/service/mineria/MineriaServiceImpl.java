package com.api.payglobal.service.mineria;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.payglobal.entity.LicenciaMineria;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.Wallet;
import com.api.payglobal.entity.enums.EstadoLicenciaMineria;
import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoWallets;
import com.api.payglobal.repository.LicenciaMineriaRepository;
import com.api.payglobal.repository.UsuarioRepository;
import com.api.payglobal.repository.WalletRepository;

@Service
public class MineriaServiceImpl implements MineriaService {

    @Autowired
    private LicenciaMineriaRepository mineriaRepository;

    @Autowired
    private WalletRepository walletRepository; 

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = false)
    public void iniciarMineria(Long mineriaLicenciaId, Integer plazo) {
        LicenciaMineria mineriaLicencia = mineriaRepository.findById(mineriaLicenciaId)
                .orElseThrow(() -> new RuntimeException("Licencia de minería no encontrada con ID: " + mineriaLicenciaId));

        LocalDateTime fechaExpiracion = LocalDateTime.now().plusMonths(plazo);
        
        // Implementación para iniciar la minería utilizando la licencia encontrada
        mineriaLicencia.setActiva(true);
        mineriaLicencia.setFechaInicio(LocalDateTime.now());
        mineriaLicencia.setFechaExpiracion(fechaExpiracion);
        mineriaLicencia.setPlazo(plazo);
        mineriaLicencia.setEstado(EstadoLicenciaMineria.ACTIVA);
        mineriaLicencia.setTasaMineria(TipoLicencia.getTasaMineriaByNombre(mineriaLicencia.getLicencia().getNombre()));
        mineriaLicencia.setGananciaActual(BigDecimal.ZERO);

        mineriaRepository.save(mineriaLicencia);
    }  

    @Override
    public void detenerMineria(Long mineriaLicenciaId) {
        LicenciaMineria mineriaLicencia = mineriaRepository.findById(mineriaLicenciaId)
                .orElseThrow(() -> new RuntimeException("Licencia de minería no encontrada con ID: " + mineriaLicenciaId));

        // Verificar si el usuario tiene wallet de minería, si no, crearla
        Long usuarioId = mineriaLicencia.getUsuario().getId();
        Wallet wallet = walletRepository.findByUsuarioIdAndTipo(usuarioId, TipoWallets.WALLET_MINERIA)
                .orElseGet(() -> crearWalletMineria(usuarioId));

        wallet.setSaldo(wallet.getSaldo().add(mineriaLicencia.getGananciaActual()));
        walletRepository.save(wallet);

        mineriaLicencia.setActiva(false);
        mineriaLicencia.setEstado(EstadoLicenciaMineria.INACTIVA);
        mineriaLicencia.setFechaExpiracion(null);
        mineriaLicencia.setPlazo(null);
        mineriaLicencia.setTasaMineria(null);
        mineriaLicencia.setFechaInicio(null);
        mineriaLicencia.setGananciaActual(BigDecimal.ZERO);

        mineriaRepository.save(mineriaLicencia);
    }

    @Override
    public void asignarRendimentoDiario() {
        // Implementación para calcular y asignar el rendimiento diario a cada licencia de minería activa
    	List<LicenciaMineria> licenciasActivas = mineriaRepository.findByEstado(EstadoLicenciaMineria.ACTIVA);
        
        for(LicenciaMineria licencia : licenciasActivas) {
            //double rDiaria  = Math.pow(1 + licencia.getTasaMineria().doubleValue(), 1.0 / 30) - 1;
            //double capitalDia = licencia.getLicencia().getPrecio() * Math.pow(1 + rDiaria, 1);
            //BigDecimal gananciaDiaria = new BigDecimal(capitalDia- licencia.getLicencia().getPrecio());   
            double rDiaria = licencia.getTasaMineria().doubleValue() * licencia.getLicencia().getPrecio(); // Tasa diaria aproximada
            licencia.setGananciaActual(licencia.getGananciaActual().add(new BigDecimal(rDiaria)));
            mineriaRepository.save(licencia);
        }
    }

    @Override
    public void verificarExpiracionLicencias() {
        // Implementación para verificar diariamente si alguna licencia de minería ha expirado y actualizar su estado en consecuencia
    	List<LicenciaMineria> licenciasActivas = mineriaRepository.findByEstado(EstadoLicenciaMineria.ACTIVA);
        
        for(LicenciaMineria licencia : licenciasActivas) {
            if(licencia.getFechaExpiracion().isBefore(LocalDateTime.now())) {
                detenerMineria(licencia.getId());
            }
        }
    }

    @Override
    public void retirarGanancias(Long usuarioId) {
        // Implementación para permitir a los usuarios retirar sus ganancias acumuladas de la minería
    	Wallet wallet = walletRepository.findByUsuarioIdAndTipo(usuarioId, TipoWallets.WALLET_MINERIA)
                .orElseThrow(() -> new RuntimeException("Wallet de minería no encontrada para el usuario con ID: " + usuarioId));

        // Lógica para transferir el saldo de la wallet de minería a la wallet de staking del usuario
    	Wallet walletStaking = walletRepository.findByUsuarioIdAndTipo(usuarioId, TipoWallets.WALLET_STAKING)
                .orElseThrow(() -> new RuntimeException("Wallet de staking no encontrada para el usuario con ID: " + usuarioId));

        walletStaking.setSaldo(walletStaking.getSaldo().add(wallet.getSaldo()));
        walletRepository.save(walletStaking);

        wallet.setSaldo(BigDecimal.ZERO);
        walletRepository.save(wallet);
    }

    @Override
    public List<LicenciaMineria> obtenerLicenciasMineriaByUsuarioId(Long usuarioId) {
        // Verificar/crear la licencia de minería principal
        LicenciaMineria licenciaPrincipal = verificarMineriaParaLicenciaPrincipal(usuarioId);
        
        // Obtener todas las licencias de minería del usuario
        List<LicenciaMineria> licencias = mineriaRepository.findByUsuarioId(usuarioId);
        
        // Asegurar que la licencia principal esté en la posición 0
        licencias.removeIf(l -> l.getId().equals(licenciaPrincipal.getId()));
        licencias.add(0, licenciaPrincipal);
        
        return licencias;
    }

    private Wallet crearWalletMineria(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        // Implementación para crear una wallet de minería para el usuario
        Wallet wallet = new Wallet();
        wallet.setTipo(TipoWallets.WALLET_MINERIA);
        wallet.setSaldo(BigDecimal.ZERO);
        wallet.setUsuario(usuario);
        return walletRepository.save(wallet);
    }
    
    private LicenciaMineria verificarMineriaParaLicenciaPrincipal(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

        // Buscar si ya existe una licencia de minería asociada a la licencia principal
        return mineriaRepository.findByLicencia_Id(usuario.getLicencia().getId())
            .orElseGet(() -> {
                // Si no existe, crear una nueva licencia de minería
                LicenciaMineria nuevaLicenciaMineria = LicenciaMineria.builder()
                    .fechaInicio(LocalDateTime.now())
                    .usuario(usuario)
                    .estado(EstadoLicenciaMineria.INACTIVA)
                    .gananciaActual(BigDecimal.ZERO)
                    .licencia(usuario.getLicencia())
                    .tasaMineria(TipoLicencia.getTasaMineriaByNombre(usuario.getLicencia().getNombre()))
                    .plazo(0)
                    .activa(false)
                    .build();
                
                return mineriaRepository.save(nuevaLicenciaMineria);
            });
    }
}
