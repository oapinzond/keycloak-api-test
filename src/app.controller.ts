// src/app.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Public, AuthenticatedUser } from 'nest-keycloak-connect'; // Decoradores útiles

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // 1. Endpoint LOGIN
  // Usamos @Public() porque AuthGuard está global, y necesitamos acceder aquí sin token
  @Public()
  @Post('login')
  async login(@Body() body: any): Promise<any> {
    // En un caso real, usar un DTO para validar body.username y body.password
    return await this.authService.login(body.username, body.password);
  }

  // 2. Endpoint MESSAGE
  // No necesita decorador extra, ya que AuthGuard es global en AppModule.
  // Si no envías token, dará 401.
  @Get('message')
  getProtectedMessage(@AuthenticatedUser() user: any) {
    return {
      message: '¡Hola! Has accedido a un endpoint protegido por Keycloak.',
      userInfo: {
        sub: user.sub,
        username: user.preferred_username // Info extraída del token
      },
    };
  }
}
