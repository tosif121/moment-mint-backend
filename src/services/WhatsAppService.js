const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');

class WhatsAppService {
  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      // Launch the browser using Puppeteer's default bundled Chromium
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      // Create a new WhatsApp client with the launched browser
      this.client = new Client({
        puppeteer: {
          browser, // Use the launched browser instance
        },
      });

      this.client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('QR RECEIVED', qr);
      });

      this.client.on('ready', () => {
        console.log('WhatsApp client is ready!');
        this.isReady = true;
      });

      this.client.on('disconnected', (reason) => {
        console.log('Client was logged out:', reason);
        this.isReady = false;
      });

      this.isReady = false;
      await this.client.initialize();
    } catch (error) {
      console.error('Failed to initialize WhatsApp client:', error);
      throw error;
    }
  }

  async sendMessage(to, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready. Please try again later.');
    }

    const chatId = to.replace('+', '') + '@c.us';
    try {
      await this.client.sendMessage(chatId, message);
      console.log(`Message sent to ${to}: ${message}`);
    } catch (error) {
      console.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      console.log('WhatsApp client disconnected.');
    }
  }
}

module.exports = new WhatsAppService();