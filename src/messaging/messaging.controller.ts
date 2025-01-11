import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create_message.dto';
import { PaginatonDTO } from 'src/global_dto/pagination.dto';

@Controller('messaging')
export class MessagingController {
    constructor(private readonly messagingService: MessagingService) { }

    @Post()
    async create(@Body() createMessageDto: CreateMessageDTO): Promise<Message> {
        return this.messagingService.createMessage(createMessageDto);
    }

    @Get('/:device_token')
    async findAll(@Query() pagination: PaginatonDTO,
        @Param('device_token') device_token: string): Promise<{ data: Message   [], total: number }> {
        return this.messagingService.findAllMessages(pagination, device_token);
    }
}
