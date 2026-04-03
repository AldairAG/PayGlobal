package com.api.payglobal.service.estadisticas;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.payglobal.dto.response.ComisionesRetirosDTO;
import com.api.payglobal.dto.response.EstadisticasDTO;
import com.api.payglobal.dto.response.GananciasLicenciasDTO;
import com.api.payglobal.dto.response.UsuariosNuevosDTO;
import com.api.payglobal.dto.response.UsuariosPorLicenciaDTO;
import com.api.payglobal.entity.Solicitud;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoSolicitud;
import com.api.payglobal.repository.SolicitudRepository;
import com.api.payglobal.repository.UsuarioRepository;

@Service
public class EstadisticasServiceImpl implements EstadisticasService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    private static final BigDecimal COMISION_RETIRO = new BigDecimal("0.10"); // 10%
    private static final Double GANANCIA_POR_LICENCIA = 15.0;

    @Override
    @Transactional(readOnly = true)
    public EstadisticasDTO obtenerEstadisticas() {
        return EstadisticasDTO.builder()
                .usuariosNuevosMes(obtenerUsuariosNuevosMes())
                .gananciasLicencias(obtenerGananciasLicencias())
                .comisionesRetiros(obtenerComisionesRetiros())
                .usuariosPorLicencia(obtenerUsuariosPorLicencia())
                .build();
    }

    private List<UsuariosNuevosDTO> obtenerUsuariosNuevosMes() {
        // Obtener el mes actual
        YearMonth mesActual = YearMonth.now();
        LocalDate inicioMes = mesActual.atDay(1);
        LocalDate finMes = mesActual.atEndOfMonth();

        // Convertir a Date para la consulta
        Date inicioMesDate = Date.from(inicioMes.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date finMesDate = Date.from(finMes.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        // Obtener todos los usuarios del mes
        List<Usuario> usuarios = usuarioRepository.findAll();

        // Filtrar usuarios del mes actual y agrupar por día
        Map<String, Long> usuariosPorDia = new HashMap<>();
        
        for (Usuario usuario : usuarios) {
            Date fechaRegistro = usuario.getFechaRegistro();
            if (fechaRegistro.after(inicioMesDate) && fechaRegistro.before(finMesDate)) {
                LocalDate fecha = fechaRegistro.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                String fechaStr = fecha.toString();
                usuariosPorDia.put(fechaStr, usuariosPorDia.getOrDefault(fechaStr, 0L) + 1);
            }
        }

        // Convertir a lista de DTOs
        return usuariosPorDia.entrySet().stream()
                .map(entry -> UsuariosNuevosDTO.builder()
                        .fecha(entry.getKey())
                        .cantidad(entry.getValue())
                        .build())
                .sorted((a, b) -> a.getFecha().compareTo(b.getFecha()))
                .collect(Collectors.toList());
    }

    private GananciasLicenciasDTO obtenerGananciasLicencias() {
        // Obtener todas las solicitudes de compra de licencia aceptadas
        List<Solicitud> solicitudes = solicitudRepository.findAll();
        
        long comprasAceptadas = solicitudes.stream()
                .filter(s -> s.getTipoSolicitud() == TipoSolicitud.COMPRA_LICENCIA)
                .filter(s -> s.getEstado() == EstadoOperacion.APROBADA)
                .count();

        // Calcular ganancias (cada compra aceptada genera $15)
        Double totalGanancias = comprasAceptadas * GANANCIA_POR_LICENCIA;

        return GananciasLicenciasDTO.builder()
                .totalComprasAceptadas(comprasAceptadas)
                .totalGanancias(totalGanancias)
                .build();
    }

    private ComisionesRetirosDTO obtenerComisionesRetiros() {
        // Obtener todas las solicitudes de retiro aceptadas
        List<Solicitud> solicitudes = solicitudRepository.findAll();
        
        List<Solicitud> retirosAceptados = solicitudes.stream()
                .filter(s -> s.getTipoSolicitud() == TipoSolicitud.SOLICITUD_RETIRO_WALLET_STAKING ||
                           s.getTipoSolicitud() == TipoSolicitud.SOLICITUD_RETIRO_WALLET_NETWORK)
                .filter(s -> s.getEstado() == EstadoOperacion.APROBADA)
                .collect(Collectors.toList());

        // Calcular el 10% de cada retiro y sumar
        BigDecimal totalComisiones = retirosAceptados.stream()
                .map(Solicitud::getMonto)
                .map(monto -> monto.multiply(COMISION_RETIRO))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        return ComisionesRetirosDTO.builder()
                .totalRetiros((long) retirosAceptados.size())
                .totalComisiones(totalComisiones)
                .build();
    }

    private List<UsuariosPorLicenciaDTO> obtenerUsuariosPorLicencia() {
        // Obtener todos los usuarios
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        // Agrupar por tipo de licencia
        Map<String, Long> usuariosPorLicencia = new HashMap<>();
        
        // Inicializar con todas las licencias en 0
        for (TipoLicencia tipo : TipoLicencia.values()) {
            usuariosPorLicencia.put(tipo.name(), 0L);
        }
        
        // Contar usuarios por licencia
        for (Usuario usuario : usuarios) {
            if (usuario.getLicencia() != null) {
                String nombreLicencia = usuario.getLicencia().getNombre();
                usuariosPorLicencia.put(nombreLicencia, 
                    usuariosPorLicencia.getOrDefault(nombreLicencia, 0L) + 1);
            }
        }

        // Convertir a lista de DTOs
        return usuariosPorLicencia.entrySet().stream()
                .map(entry -> UsuariosPorLicenciaDTO.builder()
                        .licencia(entry.getKey())
                        .cantidad(entry.getValue())
                        .build())
                .sorted((a, b) -> a.getLicencia().compareTo(b.getLicencia()))
                .collect(Collectors.toList());
    }
}
