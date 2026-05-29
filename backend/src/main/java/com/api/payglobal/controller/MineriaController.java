package com.api.payglobal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.entity.LicenciaMineria;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.helpers.ApiResponseWrapper;
import com.api.payglobal.service.mineria.MineriaService;

@RestController
@RequestMapping("/api/mineria")
public class MineriaController {
    
    @Autowired
    private MineriaService mineriaService;

    /**
     * Obtener todas las licencias de minería del usuario autenticado
     */
    @GetMapping("/licencias")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<List<LicenciaMineria>>> obtenerLicenciasUsuario(
            @AuthenticationPrincipal Usuario usuario) {
        try {
            List<LicenciaMineria> licencias = mineriaService.obtenerLicenciasMineriaByUsuarioId(usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, licencias, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Obtener licencias de minería de un usuario específico (Admin)
     */
    @GetMapping("/licencias/{usuarioId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<List<LicenciaMineria>>> obtenerLicenciasPorUsuario(
            @PathVariable Long usuarioId) {
        try {
            List<LicenciaMineria> licencias = mineriaService.obtenerLicenciasMineriaByUsuarioId(usuarioId);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, licencias, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Iniciar minería con una licencia
     */
    @PostMapping("/iniciar/{licenciaId}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<String>> iniciarMineria(
            @PathVariable Long licenciaId,
            @RequestParam Integer plazo,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            mineriaService.iniciarMineria(licenciaId, plazo);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Minería iniciada correctamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Detener minería de una licencia
     */
    @PostMapping("/detener/{licenciaId}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<String>> detenerMineria(
            @PathVariable Long licenciaId,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            mineriaService.detenerMineria(licenciaId);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Minería detenida correctamente. Las ganancias han sido transferidas a tu wallet de minería", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }

    /**
     * Retirar ganancias de minería a wallet de staking
     */
    @PostMapping("/retirar-ganancias")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<ApiResponseWrapper<String>> retirarGanancias(
            @AuthenticationPrincipal Usuario usuario) {
        try {
            mineriaService.retirarGanancias(usuario.getId());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Ganancias retiradas correctamente a tu wallet de staking", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponseWrapper<>(false, null, e.getMessage()));
        }
    }
}
