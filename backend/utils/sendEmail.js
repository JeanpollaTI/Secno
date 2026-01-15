import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Configurar API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envía un correo electrónico usando SendGrid.
 * @param {string|Array<string>} to - El destinatario o un array de destinatarios.
 * @param {string} subject - El asunto del correo.
 * @param {string} html - El cuerpo del correo en formato HTML.
 * @param {Array} attachments - Opcional: un array de archivos adjuntos (formato: { filename, content, type }).
 */
export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const msg = {
      to: to, // SendGrid acepta arrays o strings
      from: process.env.SENDGRID_FROM_EMAIL, // Debe ser un remitente verificado en SendGrid
      subject: subject,
      html: html,
      attachments: attachments.map(att => ({
        content: att.content, // Base64 string
        filename: att.filename,
        type: att.type || 'application/pdf',
        disposition: 'attachment'
      })),
    };

    await sgMail.send(msg);
    console.log(`Correo enviado exitosamente a: ${to}`);
  } catch (error) {
    console.error('Error al enviar el correo con SendGrid:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('No se pudo enviar el correo.');
  }
};