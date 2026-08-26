package com.api.payglobal.dto.request;

import java.math.BigDecimal;

import com.api.payglobal.entity.enums.TipoWallets;

import lombok.Data;

@Data
public class TransferirFondosRequest {
    private TipoWallets tipoWallet;
    private BigDecimal monto;
}
