module.exports = ({ env }) => ({
  email: {
    provider: 'smtp',
    providerOptions: {
      host: env('SMTP_HOST'), //SMTP Host
      port: env('SMTP_PORT')   , //SMTP Port
      
      username: env('SMTP_USERNAME'),
      password: env('SMTP_PASSWORD'),
     
      requireTLS: true,
      connectionTimeout: 1,
    },
    settings: {
      from: env('EMAIL_FROM'),
      replyTo: env('EMAIL_REPLY_TO'),
    },
  },
  
});
