package com.api.payglobal.service.transaccion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.api.payglobal.dto.response.GananciaDiaDTO;
import com.api.payglobal.dto.response.GananciaMesDTO;
import com.api.payglobal.entity.Transaccion;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoConceptos;
import com.api.payglobal.entity.enums.TipoCrypto;
import com.api.payglobal.entity.enums.TipoMetodoPago;
import com.api.payglobal.repository.UsuarioRepository;
import com.api.payglobal.repository.TransaccionRepository;

@Service
public class TransaccionServiceImpl implements TransaccionService {

        @Autowired
        private UsuarioRepository usuarioRepository;

        @Autowired
        private TransaccionRepository transaccionRepository;

        @Override
        @Transactional
        public void procesarTransaccion(Long usuarioId, Double monto, TipoConceptos concepto, TipoMetodoPago metodoPago,
                        EstadoOperacion estado, TipoCrypto tipoCrypto, String descripcion) {

                Usuario usuario = usuarioRepository.findById(usuarioId)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                Transaccion transaccion = Transaccion.builder()
                                .concepto(concepto)
                                .metodoPago(metodoPago)
                                .fecha(ZonedDateTime.now(ZoneId.of("Asia/Dubai")).toLocalDateTime())
                                .monto(new BigDecimal(monto))
                                .estado(estado)
                                .tipoCrypto(tipoCrypto)
                                .descripcion(descripcion)
                                .usuario(usuario)
                                .build();

                transaccionRepository.save(transaccion);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<Transaccion> listarTransacciones(Pageable pageable) {
                return transaccionRepository.findAll(pageable);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<Transaccion> filtrarTransacciones(Long usuarioId, LocalDateTime desde, LocalDateTime hasta,
                        TipoConceptos concepto,
                        EstadoOperacion estado, Pageable pageable) {
                Specification<Transaccion> spec = (root, query, cb) -> cb.conjunction();

                if (usuarioId != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("usuario").get("id"), usuarioId));
                }

                if (desde != null) {
                        spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("fecha"), desde));
                }

                if (hasta != null) {
                        spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("fecha"), hasta));
                }

                if (concepto != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("concepto"), concepto));
                }

                if (estado != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("estado"), estado));
                }

                return transaccionRepository.findAll(spec, pageable);
        }

        @Override
        @Transactional(readOnly = true)
        public List<GananciaMesDTO> obtenerGananciasPorMes(Long usuarioId) throws Exception {
                usuarioRepository.findById(usuarioId)
                                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + usuarioId));

                List<TipoConceptos> conceptos = List.of(TipoConceptos.BONO_ANUAL,
                                TipoConceptos.BONO_ANUAL, TipoConceptos.BONO_FUNDADOR,
                                TipoConceptos.BONO_RANGO, TipoConceptos.BONO_REGISTRO_DIRECTO,
                                TipoConceptos.BONO_REONOVACION_LICENCIA, TipoConceptos.INGRESO_PASIVO,
                                TipoConceptos.BONO_UNINIVEL);

                List<Transaccion> transacciones = transaccionRepository.findByUsuarioIdAndEstadoAndConceptoIn(usuarioId,
                                EstadoOperacion.COMPLETADA, conceptos);

                List<GananciaMesDTO> gananciasPorMes = new java.util.ArrayList<>();

                for (Transaccion transaccion : transacciones) {
                        LocalDateTime fechaTransaccion = transaccion.getFecha();
                        String mes = fechaTransaccion.getMonth().name() + " " + fechaTransaccion.getYear();

                        GananciaMesDTO gananciaMes = gananciasPorMes.stream()
                                        .filter(g -> g.getMes().equals(mes))
                                        .findFirst()
                                        .orElse(new GananciaMesDTO(mes, 0));

                        gananciaMes.setGanancia(gananciaMes.getGanancia() + transaccion.getMonto().doubleValue());

                        if (!gananciasPorMes.contains(gananciaMes)) {
                                gananciasPorMes.add(gananciaMes);
                        }
                }

                return gananciasPorMes;
        }

        @Override
        @Transactional(readOnly = true)
        public List<GananciaDiaDTO> obtenerGananciasUltimos30Dias(Long usuarioId) throws Exception {
                usuarioRepository.findById(usuarioId)
                                .orElseThrow(() -> new Exception("Usuario no encontrado con id: " + usuarioId));

                // Obtener fecha de hace 30 días
                LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);

                // Conceptos que se consideran como ganancias
                List<TipoConceptos> conceptos = List.of(
                                TipoConceptos.BONO_ANUAL,
                                TipoConceptos.BONO_FUNDADOR,
                                TipoConceptos.BONO_RANGO,
                                TipoConceptos.BONO_REGISTRO_DIRECTO,
                                TipoConceptos.BONO_REONOVACION_LICENCIA,
                                TipoConceptos.INGRESO_PASIVO,
                                TipoConceptos.BONO_UNINIVEL);

                // Obtener transacciones de los últimos 30 días
                List<Transaccion> transacciones = transaccionRepository
                                .findByUsuarioIdAndEstadoAndConceptoInAndFechaAfter(
                                                usuarioId,
                                                EstadoOperacion.COMPLETADA,
                                                conceptos,
                                                hace30Dias);

                // Agrupar por día
                java.util.Map<String, Double> gananciasPorDia = new java.util.HashMap<>();

                // Inicializar los últimos 30 días con ganancia 0
                for (int i = 29; i >= 0; i--) {
                        LocalDateTime fecha = LocalDateTime.now().minusDays(i);
                        String diaKey = fecha.toLocalDate().toString(); // Formato yyyy-MM-dd
                        gananciasPorDia.put(diaKey, 0.0);
                }

                // Sumar las transacciones a su día correspondiente
                for (Transaccion transaccion : transacciones) {
                        String diaKey = transaccion.getFecha().toLocalDate().toString();
                        gananciasPorDia.put(diaKey,
                                        gananciasPorDia.getOrDefault(diaKey, 0.0)
                                                        + transaccion.getMonto().doubleValue());
                }

                // Convertir el mapa a lista de DTOs ordenada por fecha
                List<GananciaDiaDTO> resultado = gananciasPorDia.entrySet().stream()
                                .sorted(java.util.Map.Entry.comparingByKey())
                                .map(entry -> new GananciaDiaDTO(entry.getKey(), entry.getValue()))
                                .collect(java.util.stream.Collectors.toList());

                return resultado;
        }

}

