package com.api.payglobal.service.email;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementación del servicio de plantillas de email
 */
@Service
public class EmailTemplateServiceImpl implements EmailTemplateService {

    @Autowired
    private EmailService emailService;

    @Override
    public void enviarEmailBienvenida(String destinatario, String nombreUsuario) throws IOException {
        String asunto = "¡Bienvenido a PayGlobal!";
        String contenidoHtml = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Bienvenido a PayGlobal!</h1>
                    </div>
                    <div class="content">
                        <h2>Hola %s,</h2>
                        <p>Gracias por registrarte en PayGlobal. Estamos emocionados de tenerte con nosotros.</p>
                        <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar a disfrutar de todos nuestros servicios.</p>
                        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                        <p>¡Bienvenido a bordo!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 PayGlobal. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """, nombreUsuario);

        emailService.enviarEmailHtml(destinatario, asunto, contenidoHtml);
    }

    @Override
    public void enviarEmailRecuperacionPassword(String destinatario, String nombreUsuario, String codigoVerificacion) throws IOException {
        String asunto = "Recuperación de Contraseña - PayGlobal";
        String contenidoHtml = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .code { background-color: #fff; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border: 2px dashed #2196F3; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                    .warning { color: #f44336; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Recuperación de Contraseña</h1>
                    </div>
                    <div class="content">
                        <h2>Hola %s,</h2>
                        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                        <p>Tu código de verificación es:</p>
                        <div class="code">%s</div>
                        <p>Este código expirará en 15 minutos.</p>
                        <p class="warning">Si no solicitaste este cambio, por favor ignora este correo y tu contraseña permanecerá sin cambios.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 PayGlobal. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """, nombreUsuario, codigoVerificacion);

        emailService.enviarEmailHtml(destinatario, asunto, contenidoHtml);
    }

    @Override
    public void enviarEmailVerificacion(String destinatario, String nombreUsuario, String codigoVerificacion) throws IOException {
        String asunto = "Verifica tu cuenta - PayGlobal";
        String contenidoHtml = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .code { background-color: #fff; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border: 2px dashed #FF9800; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Verificación de Cuenta</h1>
                    </div>
                    <div class="content">
                        <h2>Hola %s,</h2>
                        <p>Gracias por registrarte en PayGlobal. Para completar tu registro, necesitamos verificar tu correo electrónico.</p>
                        <p>Tu código de verificación es:</p>
                        <div class="code">%s</div>
                        <p>Ingresa este código en la aplicación para activar tu cuenta.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 PayGlobal. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """, nombreUsuario, codigoVerificacion);

        emailService.enviarEmailHtml(destinatario, asunto, contenidoHtml);
    }

    @Override
    public void enviarEmailNotificacionTransaccion(String destinatario, String nombreUsuario, String tipoTransaccion, String monto) throws IOException {
        String asunto = "Notificación de Transacción - PayGlobal";
        String contenidoHtml = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .transaction-details { background-color: #fff; padding: 15px; margin: 20px 0; border-left: 4px solid #9C27B0; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Notificación de Transacción</h1>
                    </div>
                    <div class="content">
                        <h2>Hola %s,</h2>
                        <p>Te informamos sobre una transacción realizada en tu cuenta.</p>
                        <div class="transaction-details">
                            <p><strong>Tipo de Transacción:</strong> %s</p>
                            <p><strong>Monto:</strong> %s</p>
                        </div>
                        <p>Si no reconoces esta transacción, por favor contacta inmediatamente con nuestro equipo de soporte.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 PayGlobal. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """, nombreUsuario, tipoTransaccion, monto);

        emailService.enviarEmailHtml(destinatario, asunto, contenidoHtml);
    }
}
