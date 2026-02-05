package com.api.payglobal.dto.request;

import lombok.Data;

@Data
public class CambiarPasswordRequest {
    private String nuevoPassword;
    private String codigoVerificacion;   
}
