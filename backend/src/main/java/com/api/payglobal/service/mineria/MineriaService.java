package com.api.payglobal.service.mineria;

public interface MineriaService {
    void iniciarMineria(Long usuarioId);

    void detenerMineria(Long usuarioId);

    void asignarRendimentoDiario();

    void verificarExpiracionLicencias();

    void retirarGanancias(Long usuarioId);

    void retirarGananciasWalletStaking(Long usuarioId);
}
