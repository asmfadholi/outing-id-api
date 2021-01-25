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
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'no-reply@outing.id',
      defaultReplyTo: 'no-reply@outing.id',
    },
  },
});
