package com.api.payglobal.service.transaccion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
                .build();

        usuario.getTransacciones().add(transaccion);
        usuarioRepository.save(usuario);
    }

        @Override
        @Transactional(readOnly = true)
        public Page<Transaccion> listarTransacciones(Pageable pageable) {
                return transaccionRepository.findAll(pageable);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<Transaccion> filtrarTransacciones(LocalDateTime desde, LocalDateTime hasta, TipoConceptos concepto,
                        EstadoOperacion estado, Pageable pageable) {
                Specification<Transaccion> spec = (root, query, cb) -> cb.conjunction();

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

}
