package com.api.payglobal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.LicenciaMineria;
import com.api.payglobal.entity.enums.EstadoLicenciaMineria;

public interface LicenciaMineriaRepository extends JpaRepository<LicenciaMineria, Long> {
    List<LicenciaMineria> findByEstado(EstadoLicenciaMineria estado);

    List<LicenciaMineria> findByUsuarioId(Long usuarioId);

    Optional<LicenciaMineria> findByLicencia_Id(Long licenciaId);
}
