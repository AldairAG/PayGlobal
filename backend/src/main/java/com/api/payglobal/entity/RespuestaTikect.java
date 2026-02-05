package com.api.payglobal.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data 
@Table(name = "respuesta_tikect")
public class RespuestaTikect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String respuesta;
    private LocalDateTime fechaRespuesta;

    @OneToMany(mappedBy = "respuestaTikect")
    @JsonBackReference
    private TiketSoporte tiketSoporte;
}
