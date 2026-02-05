package com.api.payglobal.entity.enums;
public enum TipoRango {
    RANGO_0("Rango 0", 0, 0.0),
    RANGO_1("Rango 1", 1, 10.0),
    RANGO_2("Rango 2", 2, 20.0),
    RANGO_3("Rango 3", 3, 30.0),
    RANGO_4("Rango 4", 4, 40.0),
    RANGO_5("Rango 5", 5, 50.0),
    RANGO_6("Rango 6", 6, 60.0),
    RANGO_7("Rango 7", 7, 70.0),
    RANGO_8("Rango 8", 8, 80.0),
    RANGO_9("Rango 9", 9, 90.0),
    RANGO_10("Rango 10", 10, 100.0);

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
