const decorators = require('@anatine/esbuild-decorators');

// Production bundle of the server code with no external dependencies.
require('esbuild')
  .build({
    logLevel: 'info',
    entryPoints: ['dist/main.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    platform: 'node',
    plugins: [
      decorators.esbuildDecorators({
        tsconfig: './tsconfig.app.json',
      }),
    ],

    // Optional dependencies of nest and mikro, marks them as externals because
    // we haven't installed any of them:
    external: [
      '@nestjs/websockets/socket-module',
      '@nestjs/microservices/microservices-module',
      'class-transformer/storage',
      '@nestjs/microservices',
      '@mikro-orm/sqlite',
      '@mikro-orm/mysql',
      '@mikro-orm/migrations-mongodb',
      '@mikro-orm/mariadb',
      '@mikro-orm/seeder',
      '@mikro-orm/better-sqlite',
      '@mikro-orm/postgresql',
    ],
  })
  .catch(() => process.exit(1));
