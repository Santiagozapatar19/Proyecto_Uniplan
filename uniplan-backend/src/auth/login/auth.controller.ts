import { Controller, Post, Body } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: UserLoginDto) {
    return { message: 'login stub' };
  }
}
