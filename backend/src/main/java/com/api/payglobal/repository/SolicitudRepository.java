package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Solicitud;
import com.api.payglobal.entity.enums.EstadoOperacion;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByEstado(EstadoOperacion estado);
}
