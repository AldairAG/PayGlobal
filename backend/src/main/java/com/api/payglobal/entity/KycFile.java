package com.api.payglobal.entity;

import java.time.LocalDateTime;

import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoKycFile;
import com.api.payglobal.entity.enums.TipoRechazos;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KycFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    @Enumerated(EnumType.STRING)
    private TipoKycFile fileType;
    private String filePath;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private LocalDateTime verificationDate;
    @Enumerated(EnumType.STRING)
    private EstadoOperacion estado;
    @Enumerated(EnumType.STRING)
    private TipoRechazos razonRechazo;
    private String comentarioRechazo;

    @ManyToOne
    @JsonBackReference
    private Usuario usuario;
}
