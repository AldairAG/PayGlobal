package com.api.payglobal.dto.request;

import com.api.payglobal.entity.enums.EstadoTiket;

import lombok.Data;

@Data
public class CrearTiketRequest {
    String asunto;
    String descripcion;
    String comentario;
    EstadoTiket estado;
}
