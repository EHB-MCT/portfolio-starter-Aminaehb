const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: process.env.POSTGRES_HOST, 
        port: 5432,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
      },
      seeds: {
        directory: './seeds',
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
      },
    },
};
