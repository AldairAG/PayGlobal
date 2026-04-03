package com.api.payglobal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuariosNuevosDTO {
    private String fecha; // Fecha en formato "YYYY-MM-DD"
    private Long cantidad;
}
