package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.api.payglobal.entity.Transaccion;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoConceptos;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long>, JpaSpecificationExecutor<Transaccion> {
        List<Transaccion> findByUsuarioIdAndEstadoAndConceptoIn(
            Long usuarioId,
            EstadoOperacion estado,
            List<TipoConceptos> conceptos
    );
}
