import { IsDateString, IsISO8601, IsNumber, isString, IsString } from "class-validator";

export class CreateTripDTO {


    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    contact_number: string;


    @IsISO8601()
    start_date: string;

    @IsISO8601()
    end_date: string;

    @IsNumber()
    price: number;

    // @IsString()
    // image: string;

}