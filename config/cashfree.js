

const { Payouts } = require('@cashfreepayments/cashfree-sdk');
const dotenv = require('dotenv');

dotenv.config();

const cashfreeConfig = {
  env: 'TEST', // Change to 'PRODUCTION' in production environment
  clientId: "TEST10130313d86745369a09c728e13b31303101",
  clientSecret: "cfsk_ma_test_e796dc7ccc52f14bffb6de6cdd079ca7_b0a59684",
};

const payoutsInstance = new Payouts(cashfreeConfig);

module.exports = { payoutsInstance };
