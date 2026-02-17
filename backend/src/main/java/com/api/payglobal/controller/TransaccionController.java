package com.api.payglobal.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.entity.Transaccion;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoConceptos;
import com.api.payglobal.helpers.ApiResponseWrapper;
import com.api.payglobal.service.transaccion.TransaccionService;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

	@Autowired
	private TransaccionService transaccionService;

	/**
	 * Listar transacciones (paginado)
	 */
	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ApiResponseWrapper<Page<Transaccion>>> listarTransacciones(Pageable pageable) {
		try {
			Page<Transaccion> transacciones = transaccionService.listarTransacciones(pageable);
			return ResponseEntity.ok(new ApiResponseWrapper<>(true, transacciones, null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponseWrapper<>(false, null, e.getMessage()));
		}
	}

	/**
	 * Filtrar transacciones por fecha, concepto, estado y usuario (paginado)
	 */
	@GetMapping("/filtrar")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public ResponseEntity<ApiResponseWrapper<Page<Transaccion>>> filtrarTransacciones(
			@RequestParam(required = false) Long usuarioId,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
			@RequestParam(required = false) TipoConceptos concepto,
			@RequestParam(required = false) EstadoOperacion estado,
			Pageable pageable) {
		try {
			Page<Transaccion> transacciones = transaccionService.filtrarTransacciones(
					usuarioId, desde, hasta, concepto, estado, pageable);
			return ResponseEntity.ok(new ApiResponseWrapper<>(true, transacciones, null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ApiResponseWrapper<>(false, null, e.getMessage()));
		}
	}
}
