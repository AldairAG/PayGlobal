package com.api.payglobal.entity.enums;
public enum TipoRango {
    SIN_RANGO("SIN RANGO", 0, 0.0),
    SENIOR_MANAGER("SENIOR MANAGER", 1, 5000),
    EXECUTIVE_DIRECTOR("EXECUTIVE DIRECTOR", 2, 10000),
    DIAMOND_TEAM("DIAMOND TEAM", 3, 25000),
    DOUBLE_DIAMOND("DOUBLE DIAMOND", 4, 50000),
    TRIPLE_DIAMOND("TRIPLE DIAMOND", 5, 80000),
    PRESIDENT_TEAM("PRESIDENT TEAM", 6, 120000),
    PRESIDENT_BLACK_DIAMOND("PRESIDENT BLACK DIAMOND", 7, 240000),
    CROWN_BLACK_DIAMOND("CROWN BLACK DIAMOND", 8, 480000),
    AMBASSADOR("AMBASSADOR", 9, 1000000),
    GLOBAL_AMBASSADOR("GLOBAL AMBASSADOR", 10, 2000000);


    private final String nombre;
    private final int numero;
    private final double capitalNecesario;

    TipoRango(String nombre, int numero, double capitalNecesario) {
        this.nombre = nombre;
        this.numero = numero;
        this.capitalNecesario = capitalNecesario;
    }

    public String getNombre() {
        return nombre;
    }

    public int getNumero() {
        return numero;
    }

    public double getCapitalNecesario() {
        return capitalNecesario;
    }
}
