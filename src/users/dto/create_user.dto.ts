import { IsString } from "class-validator";

export class CreateUserDTO {
    @IsString()
    phone_number: string;
    
    @IsString()
    device_token: string;
}