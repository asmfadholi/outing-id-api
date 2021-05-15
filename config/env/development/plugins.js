module.exports = ({ env }) => ({
  // email: {
  //   provider: 'mailgun',
  //   providerOptions: {
  //     apiKey: env('MAILGUN_API_KEY'),
  //     domain: env('MAILGUN_DOMAIN'),
  //   },
  //   settings: {
  //     defaultFrom: env('DEFAULT_EMAIL'),
  //     defaultReplyTo: env('DEFAULT_EMAIL'),
  //   },
  // },
  email: {
    provider: 'smtp',
    providerOptions: {
      host: env('SMTP_HOST'), //SMTP Host
      port: env('SMTP_PORT')   , //SMTP Port
      // secure: true,
      username: env('SMTP_USERNAME'),
      password: env('SMTP_PASSWORD'),
      // rejectUnauthorized: true,
      requireTLS: true,
      connectionTimeout: 1,
    },
    settings: {
      from: env('EMAIL_FROM'),
      replyTo: env('EMAIL_REPLY_TO'),
    },
  },
});
