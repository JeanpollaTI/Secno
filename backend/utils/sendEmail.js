import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Envía un correo electrónico usando Nodemailer (Gmail).
 * @param {string|Array<string>} to - El destinatario o un array de destinatarios.
 * @param {string} subject - El asunto del correo.
 * @param {string} html - El cuerpo del correo en formato HTML.
 * @param {Array} attachments - Opcional: un array de archivos adjuntos.
 */
export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    // Configuración del transporter para Gmail (SSL explícito para evitar timeouts)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true para 465, false para otros puertos
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      // Optimizaciones para evitar que se cuelgue (timeouts y debug)
      connectionTimeout: 10000, // 10 segundos máximo para conectar
      greetingTimeout: 10000,   // 10 segundos máximo para el saludo SMTP
      socketTimeout: 10000,     // 10 segundos máximo de inactividad
      logger: true, // Habilitar logs detallados en la consola
      debug: true,  // Incluir detalles de depuración
    });


    // Mapear adjuntos de formato SendGrid a formato Nodemailer
    // SendGrid usa 'content' (base64) y 'type'. Nodemailer prefiere 'encoding: base64' si content es string.
    const nodemailerAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content,
      encoding: 'base64', // Asumimos que el contenido viene en base64 como requiere SendGrid
      contentType: att.type,
    }));

    // Opciones del correo
    const mailOptions = {
      from: process.env.GMAIL_USER, // El remitente es tu correo
      to: Array.isArray(to) ? to.join(',') : to,
      subject: subject,
      html: html,
      attachments: nodemailerAttachments,
    };

    // Envía el correo
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente: ${info.messageId}`);
  } catch (error) {
    console.error('Error al enviar el correo con Nodemailer:', error);
    throw new Error('No se pudo enviar el correo.');
  }
};