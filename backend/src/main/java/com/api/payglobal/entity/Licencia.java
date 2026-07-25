package com.api.payglobal.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data 
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "licencias")
public class Licencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Integer precio;
    private Integer limite;
    private Boolean activo;
    private LocalDate fechaCompra;
    private BigDecimal saldoAcumulado;

    @OneToOne(mappedBy = "licencia")
    @JsonBackReference("licencia-mineria")
    private LicenciaMineria licenciaMineria;

    @OneToOne(optional = true)
    @JoinColumn(name = "usuario_id", nullable = true)
    @JsonBackReference("usuario-licencia")
    private Usuario usuario;
}
