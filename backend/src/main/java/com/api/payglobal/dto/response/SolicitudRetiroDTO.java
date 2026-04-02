package com.api.payglobal.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoCrypto;
import com.api.payglobal.entity.enums.TipoSolicitud;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudRetiroDTO {
    // Campos de la solicitud
    private Long id;
    private TipoSolicitud tipoSolicitud;
    private BigDecimal monto;
    private LocalDateTime fecha;
    private EstadoOperacion estado;
    private TipoCrypto tipoCrypto;
    private String walletAddress;
    private String descripcion;
    
    // Campos del usuario
    private Long usuarioId;
    private String username;
    private String email;
    private String nombre;
    private String apellido;
}
