package com.api.payglobal.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.api.payglobal.entity.enums.EstadoLicenciaMineria;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicenciaMineria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private boolean activa;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaExpiracion;

    @Enumerated(EnumType.STRING)
    private EstadoLicenciaMineria estado;

    private BigDecimal gananciaActual;

    @OneToOne
    @JsonManagedReference("licencia-mineria")
    private Licencia licencia;

    private Double tasaMineria;

    private Integer plazo; 

    @ManyToOne
    private Usuario usuario;
}


