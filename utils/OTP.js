function generateOTP() {
    const length = 6; // You can adjust the OTP length as needed
    const characters = '0123456789'; // The characters to use for the OTP
  
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
  
    return otp;
  }
  
  module.exports = { generateOTP };
  