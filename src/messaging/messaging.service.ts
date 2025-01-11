import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageDTO } from './dto/create_message.dto';
import { PaginatonDTO } from 'src/global_dto/pagination.dto';
import { of } from 'rxjs';

@Injectable()
export class MessagingService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createMessage(createMessageDto: CreateMessageDTO): Promise<Message> {

        const user = await this.userRepository.findOne({ where: { device_token: createMessageDto.device_token } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const message = this.messageRepository.create({
            ...createMessageDto,
            user
        });
        return await this.messageRepository.save(message);
    }

    async findAllMessages(paginatonDTO: PaginatonDTO, device_token: string): Promise<{ data: Message[], total: number }> {
        const { limit, offset } = paginatonDTO;
        const user = await this.userRepository.findOne({ where: { device_token: device_token }, relations: ['messages'] });
        if (!user) {
            throw new Error('User not found');
        }

        const newOffset = offset - 1;
        const [chats, total] = await this.messageRepository.findAndCount({
            // relations: ['user'],
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' }, // Order by creation date descending
            take: limit,
            skip: newOffset - 1 < 0 ? 0 : (newOffset) * limit,

        });
        return {
            data: chats,
            total,
        };
    }
}