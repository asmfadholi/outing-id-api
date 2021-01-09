module.exports = ({ env }) => ({
  email: {
    provider: 'mailgun',
    providerOptions: {
      apiKey: env('MAILGUN_API_KEY'),
      domain: env('MAILGUN_DOMAIN'),
    },
    settings: {
      defaultFrom: env('DEFAULT_EMAIL'),
      defaultReplyTo: env('DEFAULT_EMAIL'),
    },
  },
});
