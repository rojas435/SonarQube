import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Public } from '../decorators/public.decorator';
import { IsEmail, IsString } from 'class-validator';

@InputType()
class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@ObjectType()
class LoginResponse {
  @Field()
  token: string;

  @Field(() => String)
  user: string; // Puedes cambiar el tipo si tienes un UserType
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, { name: 'login' })
  @Public()
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse> {
    const { email, password } = loginInput;
    const { user, token } = await this.authService.login(email, password);
    return { user: JSON.stringify(user), token };
  }
}
