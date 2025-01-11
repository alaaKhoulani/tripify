import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/create_user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update_user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private userServise: UsersService) { }

    @Post()
    create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
        console.log(createUserDTO);
        return this.userServise.create(createUserDTO);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
        // console.log("gggggggggggggggggg");
        // console.log(id);
        return await this.userServise.update(id.toString(), updateUserDTO);
    }

}
