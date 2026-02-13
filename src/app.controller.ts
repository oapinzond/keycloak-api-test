// src/app.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Public, AuthenticatedUser, Roles } from 'nest-keycloak-connect'; // Decoradores útiles

@Controller('message')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // 1. Endpoint LOGIN
  // Usamos @Public() porque AuthGuard está global, y necesitamos acceder aquí sin token
  @Post('login')
  @Public()
  async login(@Body() body: any): Promise<any> {
    // En un caso real, usar un DTO para validar body.username y body.password
    return await this.authService.login(body.username, body.password);
  }

  // 2. Endpoint WRITE
  // Controla quienes pueden hacer escritura del mensaje para este ejemplo
  // Los perfiles habilitados se establecen mediante la propiedad 'roles' del decorador @Roles
  @Get('write')
  @Roles({ roles: ['administrator', 'developer'] })
  writeMessage() {
    return { mesage: 'Mensaje escrito exitosamente' };
  }

  // 3. Endpoint READ
  // Controla quienes pueden hacer lectura del mensaje para este ejemplo
  // Los perfiles habilitados se establecen mediante la propiedad 'roles' del decorador @Roles
  @Get('read')
  @Roles({ roles: ['administrator', 'consultor'] })
  getProtectedMessage(@AuthenticatedUser() user: any) {
    return {
      message: 'Mensaje leído exitosamente',
      userInfo: {
        sub: user.sub,
        username: user.preferred_username // Info extraída del token
      },
    };
  }
}
