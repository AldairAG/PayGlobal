package com.api.payglobal.entity.enums;

public enum TipoConceptos {
    BONO_REGISTRO_DIRECTO("Bono por registro directo", true),
    BONO_REGISTRO_INDIRECTO("Bono por registro indirecto", true),
    BONO_REONOVACION_LICENCIA("Bono por renovación de licencia", false),
    BONO_ANUAL("Bono anual", false),
    BONO_FUNDADOR("Bono fundador", false),
    PAGO_LICENCIA_DELEGADA("Pago de licencia delegada", true),
    RETIRO_FONDOS("Retiro de fondos", false),
    TRANSFERENCIA_ENTRE_USUARIOS("Transferencia entre usuarios", true);

    private final String texto;
    private final boolean requiereUsername;
    
    TipoConceptos(String texto, boolean requiereUsername) {
        this.texto = texto;
        this.requiereUsername = requiereUsername;
    }
    
    public String getTexto() {
        return texto;
    }
    
    public boolean isRequiereUsername() {
        return requiereUsername;
    }
}
