package com.api.payglobal.service.mineria;

import java.util.List;

import com.api.payglobal.entity.LicenciaMineria;

public interface MineriaService {
    void iniciarMineria(Long usuarioId);

    void detenerMineria(Long usuarioId);

    void asignarRendimentoDiario();

    void verificarExpiracionLicencias();

    void retirarGanancias(Long usuarioId);

    void retirarGananciasWalletStaking(Long usuarioId);

    List<LicenciaMineria> obtenerLicenciasMineriaByUsuarioId(Long usuarioId);
}
