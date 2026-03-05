package com.api.payglobal.service.email;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import lombok.extern.slf4j.Slf4j;

/**
 * Implementación del servicio de correo electrónico usando SendGrid API
 */
@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email:noreply@payglobal.com}")
    private String fromEmail;

    @Value("${sendgrid.from.name:PayGlobal}")
    private String fromName;

    @Override
    public void enviarEmail(String destinatario, String asunto, String contenido) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(destinatario);
        Content content = new Content("text/plain", contenido);
        Mail mail = new Mail(from, asunto, to, content);

        enviarCorreo(mail);
    }

    @Override
    public void enviarEmailHtml(String destinatario, String asunto, String contenidoHtml) throws IOException {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(destinatario);
        Content content = new Content("text/html", contenidoHtml);
        Mail mail = new Mail(from, asunto, to, content);

        enviarCorreo(mail);
    }

    @Override
    public void enviarEmailConRemitente(String destinatario, String asunto, String contenidoHtml, String remitente) throws IOException {
        Email from = new Email(remitente);
        Email to = new Email(destinatario);
        Content content = new Content("text/html", contenidoHtml);
        Mail mail = new Mail(from, asunto, to, content);

        enviarCorreo(mail);
    }

    /**
     * Método privado para enviar el correo a través de SendGrid
     */
    private void enviarCorreo(Mail mail) throws IOException {
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            log.info("Email enviado - Status Code: {}", response.getStatusCode());
            log.debug("Response Body: {}", response.getBody());
            log.debug("Response Headers: {}", response.getHeaders());
            
            // SendGrid retorna 202 cuando el email fue aceptado para envío
            if (response.getStatusCode() != 202) {
                log.error("Error al enviar email. Status: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                throw new IOException("Error al enviar el correo. Status code: " + response.getStatusCode());
            }
            
        } catch (IOException ex) {
            log.error("Error al enviar email: {}", ex.getMessage(), ex);
            throw ex;
        }
    }
}
