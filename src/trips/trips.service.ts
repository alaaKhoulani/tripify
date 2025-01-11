import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Trip } from './entities/trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateTripDTO } from './dto/create_trip.dto';
import { UpdateTripDTO } from './dto/update_trip.dto';
import { PaginatonDTO } from 'src/global_dto/pagination.dto';
import { AndroidConfig } from 'firebase-admin/lib/messaging/messaging-api';
import * as admin from 'firebase-admin';
import { User } from 'src/users/entities/user.entity';
import { join } from 'path';

@Injectable()
export class TripsService {
    constructor(
        @InjectRepository(Trip)
        private readonly tripRepository: Repository<Trip>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    // async findAll(paginatonDTO: PaginatonDTO) Promise<Trip[] > {
    //     const { limit, offset } = paginatonDTO;
    //     const result = awaitthis.tripRepository.find({ skip: offset - 1, take: limit });
    //     return { data: result };
    // }
    async findAll(paginatonDTO: PaginatonDTO): Promise<Trip[]> {
        const { limit, offset } = paginatonDTO;
        const result = await this.tripRepository.find({
            skip: offset - 1,
            take: limit
        });
        return result;
    }

    async findOne(id: string) {
        const trip = await this.tripRepository.findOneBy({ id: +id });
        if (!trip) {
            throw new NotFoundException('this user not exist');
        }
        return trip;
    }


    async create(createUSerDTO: CreateTripDTO, fileUrl: string) {
        const start_date = new Date(createUSerDTO.start_date);
        const end_date = new Date(createUSerDTO.end_date);
        // const trip = this.tripRepository.create(createUSerDTO);
        if (isNaN(start_date.getTime())) {
            throw new BadRequestException('Invalid start date format');
        }
        if (isNaN(end_date.getTime())) {
            throw new BadRequestException('Invalid end date format');
        }
        const trip = this.tripRepository.create({
            title: createUSerDTO.title,
            description: createUSerDTO.description,
            contact_number: createUSerDTO.contact_number,
            price: createUSerDTO.price,
            image: fileUrl,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString(),
        });
        this.sendMessageToTokens(trip);
        return this.tripRepository.save(trip);
    }

    async update(id: String, updateUserDTO: UpdateTripDTO) {
        const trip = await this.tripRepository.preload({ id: +id, ...updateUserDTO });

        if (!trip) {
            throw new NotFoundException('this user not exist');
        }
        return this.tripRepository.save(trip);
    }

    async remove(id: string) {
        const trip = await this.tripRepository.findOneBy({ id: +id });
        return this.tripRepository.remove([trip]);
    }


    async sendMessageToTokens(
        trip: Trip,
    ): Promise<string[]> {
        const android: AndroidConfig = {
            priority: 'high',
        };
        const apns = {
            payload: {
                aps: {
                    contentAvailable: true,
                },
            },
            headers: {
                'apns-priority': '5',
            },
        };

        const users = await this.userRepository.find({ where: { device_token: Not(IsNull()) } });
        const tokens = users.map(user => user.device_token).filter(token => token !== null);
        console.log(`tokens: ${tokens}`);
        console.log('date');
        console.log(join(trip.title, "\nprice: ", trip.price.toString()));
        return await admin.messaging()
            .sendEachForMulticast({
                tokens: tokens,
                data: { title: trip.title },
                notification: {
                    title: trip.title,
                    body: join(trip.title, " price: ", trip.price.toString()),
                },
                android: android,
                apns: apns,
            })
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens: string[] = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(tokens[idx]);
                        }
                    });
                    return failedTokens;
                } else {
                    return [];
                }
            })
            .catch((err) => {
                throw new HttpException(
                    `Error sending message: ${err.message}`,
                    HttpStatus.NO_CONTENT,
                );
            });
    }
}
