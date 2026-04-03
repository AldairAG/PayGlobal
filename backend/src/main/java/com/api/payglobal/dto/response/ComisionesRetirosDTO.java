package com.api.payglobal.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComisionesRetirosDTO {
    private Long totalRetiros;
    private BigDecimal totalComisiones; // Suma del 10% de todos los retiros
}
