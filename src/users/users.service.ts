import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create_user.dto';
import { UpdateUserDTO } from './dto/update_user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async create(createUSerDTO: CreateUserDTO) {
        const user = this.userRepository.create(createUSerDTO);
        try {
            return this.userRepository.save(user);
        } catch (error) {

            console.log(`Error creating user: ${error.message}`, error.stack);
        }
    }

    async update(id: String, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = await this.userRepository.preload({ id: +id, ...updateUserDTO });

        if (!user) {
            throw new NotFoundException('this user not exist');
        }
        return this.userRepository.save(user);
    }

    async remove(id: string) {
        const user = await this.userRepository.findOneBy({ id: +id });
        return this.userRepository.remove([user]);
    }
}
