package com.api.payglobal.entity.enums;
public enum TipoRango {
    SIN_RANGO("SIN RANGO", 0, 0.0, 0.0),
    SENIOR_MANAGER("SENIOR MANAGER", 1, 5000,150),
    EXECUTIVE_DIRECTOR("EXECUTIVE DIRECTOR", 2, 10000,300),
    DIAMOND_TEAM("DIAMOND TEAM", 3, 25000,750),
    DOUBLE_DIAMOND("DOUBLE DIAMOND", 4, 50000,1500),
    TRIPLE_DIAMOND("TRIPLE DIAMOND", 5, 80000,2500),
    PRESIDENT_TEAM("PRESIDENT TEAM", 6, 120000,3500),
    PRESIDENT_BLACK_DIAMOND("PRESIDENT BLACK DIAMOND", 7, 240000,7000),
    CROWN_BLACK_DIAMOND("CROWN BLACK DIAMOND", 8, 480000,15000),
    AMBASSADOR("AMBASSADOR", 9, 1000000,50000),
    GLOBAL_AMBASSADOR("GLOBAL AMBASSADOR", 10, 2000000, 100000);


    private final String nombre;
    private final int numero;
    private final double capitalNecesario;
    private final double bono;

    TipoRango(String nombre, int numero, double capitalNecesario, double bono) {
        this.nombre = nombre;
        this.numero = numero;
        this.capitalNecesario = capitalNecesario;
        this.bono = bono;
    }

    public String getNombre() {
        return nombre;
    }

    public int getNumero() {
        return numero;
    }

    public double getBono() {
        return bono;
    }

    public double getCapitalNecesario() {
        return capitalNecesario;
    }
}
