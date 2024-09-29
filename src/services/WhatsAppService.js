const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
  constructor() {
    this.client = new Client(); // Default Puppeteer options are used

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log('QR RECEIVED', qr);
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true; // Set a flag to indicate readiness
    });

    this.client.on('disconnected', (reason) => {
      console.log('Client was logged out:', reason);
      this.isReady = false; // Reset readiness flag
    });

    this.isReady = false; // Flag to track if the client is ready
    this.client.initialize();
  }

  async sendMessage(to, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready. Please try again later.');
    }

    const chatId = to.replace('+', '') + '@c.us'; // Format the chat ID correctly
    try {
      await this.client.sendMessage(chatId, message);
      console.log(`Message sent to ${to}: ${message}`);
    } catch (error) {
      console.error(`Failed to send message: ${error.message}`);
    }
  }

  async disconnect() {
    await this.client.destroy();
    console.log('WhatsApp client disconnected.');
  }
}

module.exports = new WhatsAppService();
