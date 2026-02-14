package com.api.payglobal.entity.enums;

public enum TipoLicencia {
    P0(0),
    P10(10),
    P25(25),
    P50(50),
    P100(100),
    P250(250),
    P500(500),
    P1000(1000),
    P2500(2500),
    P5000(5000),
    P10000(10000),
    P25000(25000),
    P50000(50000),
    P100000(100000);

    private final int valor;

    TipoLicencia(int valor) {
        this.valor = valor;
    }

    public int getValor() {
        return valor;
    }
}
