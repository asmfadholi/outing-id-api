module.exports = ({ env }) => ({
  upload: {
    provider: 'google-cloud-storage',
    providerOptions: {
        bucketName: env('BUCKET_NAME'),
        publicFiles: false,
        uniform: false,
        basePath: '',
    },
  },
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
