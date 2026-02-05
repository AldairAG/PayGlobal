package com.api.payglobal.tasks;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.api.payglobal.service.bono.BonoService;

@Component
public class tasks {
    @Autowired
    private BonoService bonoService;

    @Scheduled(cron = "0 0 0 * * MON-FRI")
    public void ingresoPasivoTask() {
        try {
            bonoService.ingresoPasivo();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Scheduled(cron = "0 15 0 * * *")
    public void asignacionRangoTask() {
        try {
            bonoService.asignacionRango();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
