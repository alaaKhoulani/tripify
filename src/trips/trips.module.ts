import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { extname, join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/users/entities/user.entity';

const uploadDir = join(process.cwd(), 'uploads');
@Module({
  imports: [TypeOrmModule.forFeature([Trip, User]),
  MulterModule.register({
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed...'), false);
      }
    },
  }),],
  controllers: [TripsController],
  providers: [TripsService]
})

export class TripsModule { }
