package com.api.payglobal.service.tiket_soporte;

import org.springframework.data.domain.Page;

import com.api.payglobal.dto.request.CrearTiketRequest;
import com.api.payglobal.entity.TiketSoporte;
import com.api.payglobal.entity.enums.EstadoTiket;

public interface SoporteService {
    TiketSoporte crearTiket(CrearTiketRequest request, Long usuarioId) throws Exception;

    TiketSoporte editarEstadoTiketPorId(Long id ,EstadoTiket estado) throws Exception;

    TiketSoporte agregarComentarioTiket(Long id, String comentario, Long usuarioId) throws Exception;

    Page<TiketSoporte> listarTiketsPorUsuario(Long usuarioId, int page, int size) throws Exception;

    Page<TiketSoporte> listarTodosLosTikets(int page, int size) throws Exception;
}
