package com.api.payglobal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    
}
