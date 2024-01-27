const crypto = require("crypto");

const jwtSecrettoken = crypto.randomBytes(32).toString("hex");
const refreshtoken = crypto.randomBytes(32).toString("hex");

async function sendWhatsAppMessage(mobileNumber, verificationCode) {
    try {
      const message =
        `🌱 Welcome to *Grow Guard!* 🚜\n\n` +
        `Get ready to grow your farming journey with us. 🌾\n\n` +
        `Your OTP is: *${verificationCode}*`;
  
      const waLink = `http://api.textmebot.com/send.php?recipient=+91${
        mobileNumber
      }&apikey=YOUR_API_KEY&text=${encodeURIComponent(message)}`;
      await axios.post(waLink);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw new Error('Failed to send WhatsApp message');
    }
  }
module.exports = { jwtSecrettoken , refreshtoken ,sendWhatsAppMessage };
