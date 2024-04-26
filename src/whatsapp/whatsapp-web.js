// En whatsapp-web.js
const { Client, LocalAuth, RemoteAuth } = require('whatsapp-web.js');
const { EventEmitter } = require('events');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');


const qrcode = require('qrcode');
const qrEmitter = new EventEmitter();
const messageEmitter = new EventEmitter();

require('dotenv').config();

let client;

const sendMessage = (chatId, message) => {
    console.log(chatId);
    console.log(message);
    client.sendMessage(chatId, message);
    messageEmitter.emit('messageSent', { chatId, message });
};

const whatsappMsg = () => {
    return new Promise((resolve, reject) => {
        // MONGOOSE
        mongoose.connect(process.env.MONGODB_URI).then(async () => {
            console.log('Connected to mongodb');

            const store = new MongoStore({ mongoose: mongoose });

            client = new Client({
                authStrategy: new RemoteAuth({
                    store: store,
                    backupSyncIntervalMs: 300000
                }),
                webVersionCache: {
                    type: 'remote',
                    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
                },
                puppeteer: {
                    headless: true,
                    args: ['--no-sandbox', "--disable-setuid-sandbox"]
                },
            });

            /* client = new Client({
                authStrategy: new LocalAuth({
                    store: store,
                    backupSyncIntervalMs: 300000
                }),
                webVersionCache: {
                    type: 'remote',
                    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
                },
                puppeteer: {
                    headless: true,
                    args: ['--no-sandbox', "--disable-setuid-sandbox"]
                },

            }); */

            client.on('qr', (qr) => {
                qrcode.toDataURL(qr, (err, url) => {
                    if (err) {
                        console.error('Error generating QR code:', err);
                        reject(err);
                    } else {
                        qrEmitter.emit('qrGenerated', url);
                    }
                });
            });

            client.on('authenticated', () => {
                console.log('WHATSAPP WEB => Authenticated');
            });

            client.on('auth_failure', msg => {
                console.error('AUTHENTICATION FAILURE', msg);
                reject(msg);
            });

            client.on('ready', async () => {
                console.log('READY');

                //const chats = await client.getChatById("59172016924@c.us");
                let chats = await client.getChats();

                // client.sendMessage(`59172016924@c.us`, 'prueba prros!');

                console.log("chats ==>" + chats);
                console.log("chats.length ==>" + chats.length);

                // vaciar los chats que estaban en cola antes de activar el bot para q no responda automatico al activar el chat
                if (chats.length > 0) chats = [];

                resolve({ client, qrEmitter, messageEmitter });

            });


            client.on("disconnected", async (reason) => {
                await client.destroy(); // Destroy the client
                console.log("disconnected reason:", reason);
            });

            await client.initialize();

        });

    });
};



module.exports = { whatsappMsg, qrEmitter, messageEmitter, sendMessage };

