import { IsBoolean, IsNumber, IsString } from "class-validator";


export class CreateMessageDTO {
    @IsString()
    device_token: string;

    @IsString()
    content: string;

    @IsBoolean()
    isSender: boolean;
}