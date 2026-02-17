package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Solicitud;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoSolicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByEstado(EstadoOperacion estado);

    Page<Solicitud> findAll(Pageable pageable);

    Page<Solicitud> findByTipoSolicitudIn(List<TipoSolicitud> tipos, Pageable pageable);

}
