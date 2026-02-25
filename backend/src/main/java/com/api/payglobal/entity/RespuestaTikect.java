package com.api.payglobal.entity;

import java.time.LocalDateTime;

import com.api.payglobal.entity.enums.TipoAutorTiket;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data 
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "respuesta_tikect")
public class RespuestaTikect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String respuesta;
    private LocalDateTime fechaRespuesta;
    private String comentario;
    @Enumerated(EnumType.STRING)
    private TipoAutorTiket autor;

    @ManyToOne
    @JoinColumn(name = "tiket_soporte_id")
    @JsonBackReference
    private TiketSoporte tiketSoporte;
}
