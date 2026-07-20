import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUrl } from "class-validator";

export class CreateJobDto {
    @ApiProperty({
        example: ["https://www.youtube.com/"],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsUrl({}, { each: true })
    urls: string[];
}
