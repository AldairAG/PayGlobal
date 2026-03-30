package com.api.payglobal.dto.request;

import lombok.Data;

/**
 * DTO para que el administrador cambie la contraseña de un usuario
 */
@Data
public class CambiarPasswordAdminRequest {
    private Long idUsuario;
    private String nuevoPassword;
}
