import { IsNumberString, IsOptional } from "class-validator";


export class searchUserDto{
    @IsOptional()
    @IsNumberString()
    readonly offset?: number;


    @IsOptional()
    @IsNumberString()
    readonly limit?: number;


}