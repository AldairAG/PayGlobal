package com.api.payglobal.service.mineria;

import java.util.List;

import com.api.payglobal.entity.LicenciaMineria;

public interface MineriaService {
    void iniciarMineria(Long licenciaId, Integer plazo);

    void detenerMineria(Long mineriaLicenciaId);

    void asignarRendimentoDiario();

    void verificarExpiracionLicencias();

    void retirarGanancias(Long usuarioId);

    List<LicenciaMineria> obtenerLicenciasMineriaByUsuarioId(Long usuarioId);
}
