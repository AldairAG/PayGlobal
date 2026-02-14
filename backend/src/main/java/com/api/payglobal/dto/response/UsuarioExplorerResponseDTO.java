package com.api.payglobal.dto.response;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioExplorerResponseDTO {
    private String username;
    private String email;
    private Long id;
    private Date fechaRegistro;
}
