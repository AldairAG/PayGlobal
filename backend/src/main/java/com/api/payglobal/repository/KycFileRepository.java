package com.api.payglobal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.KycFile;
import com.api.payglobal.entity.enums.EstadoOperacion;

public interface KycFileRepository extends JpaRepository<KycFile, Long> {
    List<KycFile> findByUsuario_Id(Long idUsuario);
    List<KycFile> findByEstado(EstadoOperacion estado);
    
}
