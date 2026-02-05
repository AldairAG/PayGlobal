package com.api.payglobal.entity;

import com.api.payglobal.entity.enums.TipoConceptos;
import com.api.payglobal.entity.enums.TipoMetodoPago;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "transacciones")
@Data
@SuperBuilder
@EqualsAndHashCode(callSuper=false)
public class Transaccion extends Operacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private TipoConceptos concepto;
    private TipoMetodoPago metodoPago;

    @ManyToOne
    @JsonBackReference
    private Usuario usuario;
}
