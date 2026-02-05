package com.api.payglobal.entity;

import java.math.BigDecimal;

import com.api.payglobal.entity.enums.CodigoTipoBono;
import com.api.payglobal.entity.enums.TipoBono;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "bonos")
@Data
public class Bono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private CodigoTipoBono codigo;
    private TipoBono nombre;
    private BigDecimal acumulado;

    @ManyToOne
    @JsonManagedReference
    private Usuario usuario;

}
