import { IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class searchDto{


    //Todavia no se si este DTO es necesario
    @IsOptional()
    @IsNumberString()
    readonly offset?: number;

    @IsOptional()
    @IsNumberString()
    readonly limit?: number;

}