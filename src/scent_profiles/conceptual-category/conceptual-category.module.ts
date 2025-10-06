import { Module } from '@nestjs/common';
import { ConceptualCategoryService } from './conceptual-category.service';
import { ConceptualCategoryController } from './conceptual-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptualCategory } from './entities/conceptual-category.entity';

@Module({
  controllers: [ConceptualCategoryController],
  providers: [ConceptualCategoryService],
  imports: [TypeOrmModule.forFeature([ConceptualCategory])],
})
export class ConceptualCategoryModule {}
