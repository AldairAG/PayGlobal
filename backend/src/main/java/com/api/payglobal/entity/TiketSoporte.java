package com.api.payglobal.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data 
@Table(name = "tiket_soporte")
public class TiketSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String asunto;
    private LocalDateTime fechaCreacion;
    private String estado;
    private String descripcion;

    @OneToOne
    private Usuario usuario;

    @ManyToOne
    @JsonManagedReference
    private List<RespuestaTikect> respuestaTikect;

    
}
