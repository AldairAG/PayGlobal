package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.Licencia;

public interface LicenciaRepository extends JpaRepository<Licencia, Long> {
    List<Licencia> findByActivoTrue();
}
