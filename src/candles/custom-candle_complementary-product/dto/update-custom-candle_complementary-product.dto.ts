import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCustomCandleComplementaryProductDto } from './create-custom-candle_complementary-product.dto';

@InputType()
export class UpdateCustomCandleComplementaryProductDto extends PartialType(CreateCustomCandleComplementaryProductDto) {
  @Field(() => Int)
  id: number;
}
