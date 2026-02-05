package com.api.payglobal.entity.enums;

public enum TipoLicencia {
    LICENCIA1(100),
    LICENCIA2(200),
    LICENCIA3(500),
    LICENCIA4(1000),
    LICENCIA5(3000),
    LICENCIA6(5000),
    LICENCIA7(10000),
    LICENCIA8(15000),
    LICENCIA9(25000),
    LICENCIA10(50000);

    private final int valor;

    TipoLicencia(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }
}
