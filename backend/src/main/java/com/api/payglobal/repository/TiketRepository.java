package com.api.payglobal.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.api.payglobal.entity.TiketSoporte;

public interface TiketRepository extends JpaRepository<TiketSoporte, Long> {
    Page<TiketSoporte> findByUsuario_id(long id, Pageable pageable);
}
