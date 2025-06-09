import { PartialType } from '@nestjs/mapped-types';
import { CreateVCardDto } from './create-vcard.dto';

export class UpdateVCardDto extends PartialType(CreateVCardDto) {}
