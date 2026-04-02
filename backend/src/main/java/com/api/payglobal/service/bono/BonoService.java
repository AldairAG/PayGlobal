package com.api.payglobal.service.bono;

import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoRango;

public interface BonoService {
    
    void bonoInscripcion(TipoLicencia tipoLicencia, String usernameReferido,Double precioLicenciaAnterior) throws Exception;

    void bonoRenovacion(TipoLicencia tipoLicencia, String usernameReferido) throws Exception;

    void bonoRango(String usernameReferido) throws Exception;

    void ingresoPasivo() throws Exception;

    void bonoUninivel(String usernameReferido, Double monto,TipoRango tipoRango) throws Exception;

    void asignacionRango() throws Exception;

    void bonoAuto() throws Exception;

}
