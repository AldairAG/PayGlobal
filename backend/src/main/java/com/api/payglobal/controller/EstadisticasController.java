package com.api.payglobal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.dto.response.EstadisticasDTO;
import com.api.payglobal.helpers.ApiResponseWrapper;
import com.api.payglobal.service.estadisticas.EstadisticasService;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    /**
     * Obtener todas las estadísticas del dashboard
     * GET /api/estadisticas
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponseWrapper<EstadisticasDTO>> obtenerEstadisticas() {
        try {
            EstadisticasDTO estadisticas = estadisticasService.obtenerEstadisticas();
            return ResponseEntity.ok(
                    new ApiResponseWrapper<>(true, estadisticas, "Estadísticas obtenidas correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponseWrapper<>(false, null, "Error al obtener estadísticas: " + e.getMessage()));
        }
    }
}
