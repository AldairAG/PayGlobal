package com.api.payglobal.service.bono;

import com.api.payglobal.entity.Wallet;
import com.api.payglobal.entity.enums.TipoLicencia;
import com.api.payglobal.entity.enums.TipoRango;

public interface BonoService {
    
    void bonoInscripcion(TipoLicencia tipoLicencia, String usernameReferido) throws Exception;

    void bonoRenovacion(TipoLicencia tipoLicencia, String usernameReferido) throws Exception;

    Wallet bonoRango(Wallet wallet, String usernameReferido) throws Exception;

    void ingresoPasivo() throws Exception;

    void bonoUninivel(String usernameReferido, Double monto,TipoRango tipoRango) throws Exception;

    void asignacionRango() throws Exception;

}
