package com.api.payglobal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.api.payglobal.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);

    @Query("SELECT u FROM Usuario u WHERE u.username = :identifier OR u.email = :identifier")
    Optional<Usuario> findByUsernameOrEmailForLogin(@Param("identifier") String identifier);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<Usuario> findByReferenciado(String referenciado);

    @Query("SELECT u FROM Usuario u WHERE " +
           "(:filtro IS NULL OR :filtro = '' OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "LOWER(u.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :filtro, '%')))")
    Page<Usuario> buscarUsuarios(@Param("filtro") String filtro, Pageable pageable);
}
