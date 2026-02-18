package com.api.payglobal.service.transaccion;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
                                .fecha(LocalDateTime.now())
                                .monto(new BigDecimal(monto))
                                .estado(estado)
                                .tipoCrypto(tipoCrypto)
                                .descripcion(descripcion)
                                .usuario(usuario)
                                .build();

                usuario.getTransacciones().add(transaccion);
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

}
