package com.api.payglobal.entity.enums;

public enum TipoLicencia {
    P0(0,0.01),
    P50(50,0.01),
    P100(100,0.01),
    P250(250,0.01),
    P500(500,0.01),
    P1000(1000,0.015),
    P2500(2500,0.015),
    P5000(5000,0.02),
    P7500(7500,0.02),
    P10000(10000,0.025),
    P15000(15000,0.025),
    P25000(25000,0.03),
    P50000(50000,0.03),
    P100000(100000,0.03);

    private final int valor;
    private final double rendimientoMineria;

    TipoLicencia(int valor, double rendimientoMineria) {
        this.valor = valor;
        this.rendimientoMineria = rendimientoMineria;
    }

    public int getValor() {
        return valor;
    }

    public double getRendimientoMineria() {
        return rendimientoMineria;
    }

    public static double getTasaMineriaByNombre(String nombre) {
        for (TipoLicencia tipo : TipoLicencia.values()) {
            if (tipo.name().equalsIgnoreCase(nombre)) {
                return tipo.getRendimientoMineria();
            }
        }
        throw new IllegalArgumentException("No se encontró el tipo de licencia: " + nombre);
    }
}
