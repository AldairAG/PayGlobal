package com.api.payglobal.service.email;

import java.io.IOException;

/**
 * Servicio para el envío de correos electrónicos con plantillas predefinidas
 */
public interface EmailTemplateService {
    
    /**
     * Envía un correo de bienvenida al usuario
     * @param destinatario Email del destinatario
     * @param nombreUsuario Nombre del usuario
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmailBienvenida(String destinatario, String nombreUsuario) throws IOException;
    
    /**
     * Envía un correo para recuperación de contraseña
     * @param destinatario Email del destinatario
     * @param nombreUsuario Nombre del usuario
     * @param codigoVerificacion Código de verificación para recuperar contraseña
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmailRecuperacionPassword(String destinatario, String nombreUsuario, String codigoVerificacion) throws IOException;
    
    /**
     * Envía un correo de verificación de cuenta
     * @param destinatario Email del destinatario
     * @param nombreUsuario Nombre del usuario
     * @param codigoVerificacion Código de verificación
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmailVerificacion(String destinatario, String nombreUsuario, String codigoVerificacion) throws IOException;
    
    /**
     * Envía una notificación de transacción
     * @param destinatario Email del destinatario
     * @param nombreUsuario Nombre del usuario
     * @param tipoTransaccion Tipo de transacción (depósito, retiro, transferencia)
     * @param monto Monto de la transacción
     * @throws IOException Si hay un error al enviar el correo
     */
    void enviarEmailNotificacionTransaccion(String destinatario, String nombreUsuario, String tipoTransaccion, String monto) throws IOException;
}
