package com.api.payglobal.dto.response;

import com.api.payglobal.entity.Licencia;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioEnRedResponse {
    private String username;
    private Licencia licencia;
    private Integer nivel;
    private String referido;
}
