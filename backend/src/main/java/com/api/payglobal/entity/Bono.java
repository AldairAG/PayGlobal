package com.api.payglobal.entity;

import java.math.BigDecimal;

import com.api.payglobal.entity.enums.TipoBono;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "bonos")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Bono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoBono nombre;
    private BigDecimal acumulado;

    @ManyToOne
    @JsonManagedReference
    private Usuario usuario;

}
