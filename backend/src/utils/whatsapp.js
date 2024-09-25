const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendWhatsApp = async (to, message) => {
    try {
        await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`,
            body: message
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};

exports.sendNewsWhatsApp = async (to, title, text, imageUrl) => {
    const messageContent = `
        *${title}*
        ${text}

        Imagen: ${imageUrl}
    `;

    try {
        await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`,
            body: messageContent
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};