package com.api.payglobal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para el envío de correos electrónicos
 */
@Data
public class EnviarEmailRequest {
    
    @NotBlank(message = "El destinatario es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String destinatario;
    
    @NotBlank(message = "El asunto es obligatorio")
    private String asunto;
    
    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;
    
    private Boolean esHtml = true; // Por defecto, enviamos en formato HTML
    
    private String remitente; // Opcional, si no se especifica usa el configurado por defecto
}
