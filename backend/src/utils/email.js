const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendEmail = async (to, subject, text) => {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #f8f8f8; padding: 20px;">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">${subject}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 20px;">${text}</p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #fff;">
            <img src="https://imagenes.eltiempo.com/files/image_652_366/uploads/2022/11/09/636bba94552c2.jpeg" alt="Imagen relevante" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
        <div style="background-color: #f8f8f8; padding: 10px; text-align: center;">
            <p style="color: #777; font-size: 14px;">Gracias por tu atención.</p>
        </div>
    </div>
`;


    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


exports.sendNewsEmail = async (to, subject, text, imageUrl) => {

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #f8f8f8; padding: 20px;">
                <h2 style="color: #333; text-align: center;">${subject}</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">${text}</p>
            </div>
            <div style="text-align: center; padding: 20px; background-color: #fff;">
                <img src="${imageUrl}" alt="Imagen de la noticia" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>
            <div style="background-color: #f8f8f8; padding: 10px; text-align: center;">
                <p style="color: #777; font-size: 14px;">Gracias por estar al tanto de nuestras novedades.</p>
            </div>
        </div>
    `;

    console.log(to);

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

