// En generateQRController.js
const { qrEmitter } = require('../whatsapp/whatsapp-web');

const generateQRController = async (req, res) => {
    try {
        // Esperar hasta que el evento 'qrGenerated' se emita
        const base64String = await new Promise((resolve) => {
            qrEmitter.once('qrGenerated', (qrUrl) => {
                const base64 = qrUrl.split(',')[1];
                resolve(base64);
            });
        });

        console.log('QR code generated as base64:', base64String);
        res.send({ url: base64String });

    } catch (error) {
        res.status(500).json({ message: 'Error generating QR code' });
        console.error('Error initializing WhatsApp client:', error);
    }
};

module.exports = {
    generateQRController
};

