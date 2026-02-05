package com.api.payglobal.dto.request;

import lombok.Data;

@Data
public class EditarPerfilRequest {
    private String nombre;
    private String apellido;
    private String telefono;
    private String pais;
    
}
