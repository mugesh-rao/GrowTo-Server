const axios = require('axios');

async function sendOtpViaWhatsApp(mobileNumber, otp) {
  try {
    const message = `🌱 Welcome to *GrowTo.in!* 🚜\n\n` +
                    `Get ready to grow your farming journey with us. 🌾\n\n` +
                    `Use This OTP for Login \n\n` +
                    `Your OTP is: *${otp}*`;

    const waLink = `http://api.textmebot.com/send.php?recipient=+91${mobileNumber}&apikey=Hwd2BzkcxSY4&text=${encodeURIComponent(message)}`;
    
    await axios.post(waLink);
    console.log('OTP sent successfully to', mobileNumber);
  } catch (error) {
    console.error('Error sending OTP via WhatsApp:', error);
    throw new Error('Failed to send OTP');
  }
}
