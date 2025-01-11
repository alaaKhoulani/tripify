import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('uploads/:filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename); // Construct an absolute path
    console.log("filePath: ", filePath);
    // return res.sendFile(filePath); // Specify root if needed

    // Send the file
    return res.sendFile(filePath, (err) => {
      if (err) {
        res.status(400).end();
        
      }
    });
  }

}
