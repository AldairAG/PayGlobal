package com.api.payglobal.dto.request;

import com.api.payglobal.entity.enums.TipoCrypto;

import lombok.Data;

@Data
public class CreateWalletAddress {
    private String address;

    private TipoCrypto tipoCrypto;

    private String nombre;

}