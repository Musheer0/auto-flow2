import DodoPayments from 'dodopayments';

export const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: 'test_mode', // defaults to 'live_mode'
});
