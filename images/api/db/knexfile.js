module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'localhost',
        port: 5432,
        user: "admin",
        database: "db",
        password: "admin",
      },
      seeds: {
        directory: './db/seeds',
    },
      migrations: {
        tableName: 'knex_migrations',
        directory: './db/migrations',
    },
    },
  };