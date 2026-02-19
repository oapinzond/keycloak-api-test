import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'nest-keycloak-connect';
import { LoginDto } from 'src/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint LOGIN
  // Usamos @Public() porque AuthGuard está global, y necesitamos acceder aquí sin token
  @Post('login')
  @Public()
  async login(@Body() body: LoginDto): Promise<any> {
    // En un caso real, usar un DTO para validar body.username y body.password
    return await this.authService.login(body.username, body.password);
  }
}
