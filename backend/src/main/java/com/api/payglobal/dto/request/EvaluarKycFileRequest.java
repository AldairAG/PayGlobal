package com.api.payglobal.dto.request;

import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoRechazos;

import lombok.Data;

@Data
public class EvaluarKycFileRequest {
    private EstadoOperacion nuevoEstado;
    private String comentario;
    private TipoRechazos razonRechazo;
}
