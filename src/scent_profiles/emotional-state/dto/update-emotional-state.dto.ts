import { PartialType } from '@nestjs/mapped-types';
import { CreateEmotionalStateDto } from './create-emotional-state.dto';

export class UpdateEmotionalStateDto extends PartialType(CreateEmotionalStateDto) {}
