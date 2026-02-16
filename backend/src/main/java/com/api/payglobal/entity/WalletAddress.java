package com.api.payglobal.entity;

import java.math.BigDecimal;

import com.api.payglobal.entity.enums.TipoCrypto;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wallet_addresses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    private TipoCrypto tipoCrypto;

    private String nombre;

    private BigDecimal balanceRetirado;

    @ManyToOne
    @JsonBackReference
    private Usuario usuario;
}
