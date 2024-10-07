const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    // Listen for QR code generation
    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      console.log('QR RECEIVED', qr);
    });

    // Handle the WhatsApp client being ready
    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    // Handle disconnection
    this.client.on('disconnected', (reason) => {
      console.log('Client was logged out:', reason);
      this.isReady = false;
    });

    this.isReady = false;
    this.client.initialize(); // Initialize the WhatsApp client
  }

  // Method to send a message
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

  // Method to disconnect the client
  async disconnect() {
    await this.client.destroy();
    console.log('WhatsApp client disconnected.');
  }
}

module.exports = new WhatsAppService();
