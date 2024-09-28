const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log('QR RECEIVED', qr);
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true; // Set a flag to indicate readiness
    });

    this.isReady = false; // Flag to track if the client is ready
    this.client.initialize();
  }

  async sendMessage(to, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready. Please try again later.');
    }

    const chatId = to.replace('+', '') + '@c.us'; // Format the chat ID correctly
    await this.client.sendMessage(chatId, message);
  }
}

module.exports = new WhatsAppService();
