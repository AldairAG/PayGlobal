package com.api.payglobal.entity;

import java.math.BigDecimal;

import com.api.payglobal.entity.enums.CodigoTipoWallets;
import com.api.payglobal.entity.enums.TipoWallets;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "wallets")
@Data
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TipoWallets tipo;
    private CodigoTipoWallets codigo;
    private BigDecimal saldo;

    @ManyToOne
    @JsonBackReference
    private Usuario usuario;

}
