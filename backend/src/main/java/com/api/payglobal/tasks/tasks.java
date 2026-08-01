package com.api.payglobal.tasks;
//prueba de reinicio de servidor
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.api.payglobal.service.bono.BonoService;
import com.api.payglobal.service.mineria.MineriaService;

@Component
public class tasks {
    @Autowired
    private BonoService bonoService;

    @Autowired
    private MineriaService mineriaService;

    @Scheduled(cron = "0 0 0 * * MON-FRI")
    //@Scheduled(fixedRate = 60000)
    public void ingresoPasivoTask() {
        try {
            bonoService.ingresoPasivo();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Scheduled(cron = "0 0 0 1 * *")
    public void bonoAutoTask() {
        try {
            bonoService.bonoAuto();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(cron = "0 0 1 1 * *")
    //@Scheduled(fixedRate = 60000)
    public void mineriaTask() {
        try {
            mineriaService.asignarRendimentoDiario();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(cron = "0 0 1 1 * *")
    //@Scheduled(fixedRate = 60000)
    public void finalizarMineriaTask() {
        try {
            mineriaService.verificarExpiracionLicencias();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //Ejecutar a las 13:05 horas todos los días
    @Scheduled(cron = "0 5 13 * * *")
    public void verificarLicenciasInactivasTask() {
        try {
            mineriaService.regularizarRendimientoDiario();;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
