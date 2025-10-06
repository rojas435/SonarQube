import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptualCategoryDto } from './create-conceptual-category.dto';

export class UpdateConceptualCategoryDto extends PartialType(CreateConceptualCategoryDto) {}