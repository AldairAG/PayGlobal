package com.api.payglobal.service.email;

import java.io.IOException;

/**
 * Servicio para el envío de correos electrónicos mediante SendGrid
 */
public interface EmailService {
    
    /**
     * Envía un correo electrónico simple
     * @param destinatario Email del destinatario
     * @param asunto Asunto del correo
     * @param contenido Contenido del correo (texto plano)
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmail(String destinatario, String asunto, String contenido) throws IOException;
    
    /**
     * Envía un correo electrónico con contenido HTML
     * @param destinatario Email del destinatario
     * @param asunto Asunto del correo
     * @param contenidoHtml Contenido del correo en formato HTML
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmailHtml(String destinatario, String asunto, String contenidoHtml) throws IOException;
    
    /**
     * Envía un correo electrónico con plantilla personalizada
     * @param destinatario Email del destinatario
     * @param asunto Asunto del correo
     * @param contenidoHtml Contenido del correo en formato HTML
     * @param remitente Email del remitente (opcional, si no se especifica usa el por defecto)
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmailConRemitente(String destinatario, String asunto, String contenidoHtml, String remitente) throws IOException;
}
