package com.api.payglobal.service.transaccion;

import com.api.payglobal.dto.response.GananciaMesDTO;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.entity.enums.TipoConceptos;
import com.api.payglobal.entity.enums.TipoCrypto;
import com.api.payglobal.entity.enums.TipoMetodoPago;
import com.api.payglobal.entity.Transaccion;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransaccionService {
    void procesarTransaccion(Long usuarioId, Double monto, TipoConceptos concepto, TipoMetodoPago metodoPago,
            EstadoOperacion estado, TipoCrypto tipoCrypto, String patrocinador) throws Exception;

    Page<Transaccion> listarTransacciones(Pageable pageable);

    Page<Transaccion> filtrarTransacciones(Long usuarioId, LocalDateTime desde, LocalDateTime hasta, TipoConceptos concepto,
            EstadoOperacion estado, Pageable pageable);
    
    List<GananciaMesDTO> obtenerGananciasPorMes(Long usuarioId) throws Exception;
}
