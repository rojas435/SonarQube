import 'reflect-metadata';
import { Resolver, Query } from 'type-graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
@Resolver()
export class BasicResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello, GraphQL!';
  }

  @Query(() => String, { name: 'testQuery' })
  testQuery(): string {
    return 'Test query is working!';
  }
}
