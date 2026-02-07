package com.api.payglobal.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoCrypto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "operaciones")
@Data
@SuperBuilder
public abstract class Operacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal monto;

    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    private EstadoOperacion estado;

    @Enumerated(EnumType.STRING)
    private TipoCrypto tipoCrypto;

    private String descripcion;
}
