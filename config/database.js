module.exports = ({ env }) => {
  if (env('NODE_ENV') === 'production') {
    return {
      defaultConnection: 'default',
      connections: {
        default: {
          connector: 'bookshelf',
          settings: {
            client: 'postgres',
            host: env('DATABASE_HOST', '127.0.0.1'),
            port: env('DATABASE_PORT', 27017),
            database: env('DATABASE_NAME', 'strapi'),
            username: env('DATABASE_USERNAME', ''),
            password: env('DATABASE_PASSWORD', ''),
            ssl: { rejectUnauthorized: false },
            schema: 'public',
          },
          options: {
            ssl: false
          },
        },
      },
    }
  } else {
    return {
      defaultConnection: 'default',
      connections: {
        default: {
          connector: 'bookshelf',
          settings: {
            client: 'sqlite',
            filename: env('DATABASE_FILENAME', '.tmp/data.db'),
          },
          options: {
            useNullAsDefault: true,
          },
        },
      },
    }
  }
};

// module.exports = ({ env }) => {
//   return {
//     defaultConnection: 'default',
//     connections: {
//       default: {
//         connector: 'bookshelf',
//         settings: {
//           client: 'sqlite',
//           filename: env('DATABASE_FILENAME', '.tmp/data.db'),
//         },
//         options: {
//           useNullAsDefault: true,
//         },
//       },
//     },
//   }
// };
