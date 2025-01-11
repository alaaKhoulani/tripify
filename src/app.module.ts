import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsModule } from './trips/trips.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessagingModule } from './messaging/messaging.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', '/uploads'), // Adjust path if necessary
      // serveRoot: '/uploads/', // Base URL to access uploaded files
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'admin_tripify',
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TripsModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
