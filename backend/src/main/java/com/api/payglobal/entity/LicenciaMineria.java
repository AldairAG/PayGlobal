package com.api.payglobal.entity;

import java.math.BigDecimal;
import java.sql.Date;

import com.api.payglobal.entity.enums.EstadoLicenciaMineria;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class LicenciaMineria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Date fechaInicio;
    private Date fechaExpiracion;

    @Enumerated(EnumType.STRING)
    private EstadoLicenciaMineria estado;

    private BigDecimal gananciaActual;

    @OneToOne
    private Licencia licencia;

    private Float tasaMineria;

    private Integer plazo; 

    @ManyToOne
    private Usuario usuario;
}


