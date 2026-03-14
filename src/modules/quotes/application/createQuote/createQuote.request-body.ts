import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateQuoteRequestBody {
    @ApiProperty({
        type: 'string',
    })
    @IsUUID()
    mentorId: string;

    @ApiProperty({
        type: 'string',
    })
    @IsString()
    quote: string;

    @ApiProperty({
        type: 'string',
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    photoUrl?: string | null;
}
