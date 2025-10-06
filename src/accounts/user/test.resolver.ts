import 'reflect-metadata';
import { Resolver, Query } from 'type-graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
@Resolver()
export class TestResolver {
  @Query(() => String)
  testField(): string {
    return 'Test field is working!';
  }
}
