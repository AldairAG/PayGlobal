package com.api.payglobal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuariosPorLicenciaDTO {
    private String licencia; // Nombre de la licencia (P0, P10, P25, etc.)
    private Long cantidad; // Cantidad de usuarios con esta licencia
}
