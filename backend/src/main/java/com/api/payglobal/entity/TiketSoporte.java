package com.api.payglobal.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.api.payglobal.entity.enums.EstadoTiket;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "tiket_soporte")
public class TiketSoporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String asunto;
    private LocalDateTime fechaCreacion;
    @Enumerated(EnumType.STRING)
    private EstadoTiket estado;
    private String descripcion;
    private Integer numeroComentarios;

    @OneToOne
    @JsonBackReference
    @JsonIgnore
    private Usuario usuario;

    @OneToMany(mappedBy = "tiketSoporte", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RespuestaTikect> respuestaTikect;

    

    
}
