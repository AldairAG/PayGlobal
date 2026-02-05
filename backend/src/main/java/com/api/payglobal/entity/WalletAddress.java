package com.api.payglobal.entity;

import java.math.BigDecimal;

import com.api.payglobal.entity.enums.TipoCrypto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "wallet_addresses")
@Data
public class WalletAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    private TipoCrypto tipoCrypto;

    private String nombre;

    private BigDecimal balanceRetirado;

    @ManyToOne
    private Usuario usuario;
}
