package com.api.payglobal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GananciasLicenciasDTO {
    private Long totalComprasAceptadas;
    private Double totalGanancias; // Total de ganancias (compras * 15)
}
