import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/validations/file.validation';
import { CreateTripDTO } from './dto/create_trip.dto';
import { UpdateTripDTO } from './dto/update_trip.dto';
import { TripsService } from './trips.service';
import { PaginatonDTO } from 'src/global_dto/pagination.dto';

@Controller('trips')
export class TripsController {
    constructor(private tripeServise: TripsService) { }

    // @Post('/uploadImage')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadImage(@UploadedFile() file: Express.Multer.File) {
    //     console.log(file);
    //     const fileUrl = `/uploads/${file.filename}`;
    //     // const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    //     return {
    //         url: fileUrl,
    //     };
    // }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() createUserDTO: CreateTripDTO, @UploadedFile() file: Express.Multer.File) {
        console.log(createUserDTO);
        console.log(file);
        const fileUrl = `/uploads/${file.filename}`;
        return this.tripeServise.create(createUserDTO, fileUrl);
    }

    @Patch(': id')
    update(@Param('id') id: string, @Body() updateUserDTO: UpdateTripDTO) {
        return this.tripeServise.update(id, updateUserDTO);
    }

    @Get()
    async findAll(@Query() pagination: PaginatonDTO) {
        return { data: await this.tripeServise.findAll(pagination) };
    }

    @Get(':id')
    findOne(@Param() id: string) {
        return this.tripeServise.findOne(id);
    }
}


