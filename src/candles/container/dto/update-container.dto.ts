import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length, IsOptional } from 'class-validator';

@InputType()
export class UpdateContainerDto {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    readonly name?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    readonly image_url?: string;
}