package com.api.payglobal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.dto.request.CrearTiketRequest;
import com.api.payglobal.entity.TiketSoporte;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.helpers.ApiResponseWrapper;
import com.api.payglobal.service.tiket_soporte.SoporteService;

@RestController
@RequestMapping("/api/soporte")
public class SoporteController {

    @Autowired
    private SoporteService soporteService;

    /**
     * Crear un nuevo tiket de soporte
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<TiketSoporte>> crearTiket(
            @RequestBody CrearTiketRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            TiketSoporte tiket = soporteService.crearTiket(request, usuario.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponseWrapper<>(true, tiket, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Actualizar el estado de un tiket (solo admins)
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('USUARIO', 'ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<TiketSoporte>> actualizarEstadoTiket(
            @PathVariable Long id,
            @RequestBody CrearTiketRequest request) {
        try {
            TiketSoporte tiket = soporteService.editarEstadoTiketPorId(id, request.getEstado());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, tiket, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Agregar un comentario/respuesta a un tiket
     */
    @PostMapping("/{id}/comentarios")
    @PreAuthorize("hasAnyRole('USUARIO', 'ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<TiketSoporte>> agregarComentario(
            @PathVariable Long id,
            @RequestBody CrearTiketRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            TiketSoporte tiket = soporteService.agregarComentarioTiket(id, request.getComentario(), usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, tiket, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Listar los tikets del usuario autenticado
     */
    @GetMapping("/mis-tikets")
    @PreAuthorize("hasAnyRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<Page<TiketSoporte>>> listarMisTikets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            Page<TiketSoporte> tikets = soporteService.listarTiketsPorUsuario(usuario.getId(), page, size);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, tikets, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Listar todos los tikets (solo admins)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<Page<TiketSoporte>>> listarTodosLosTikets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<TiketSoporte> tikets = soporteService.listarTodosLosTikets(page, size);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, tikets, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }
}
