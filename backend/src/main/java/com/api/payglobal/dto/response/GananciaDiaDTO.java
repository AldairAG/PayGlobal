package com.api.payglobal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GananciaDiaDTO {
    private String fecha; // Formato: yyyy-MM-dd
    private double ganancia;
}
