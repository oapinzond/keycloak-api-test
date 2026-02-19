// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Roles } from 'nest-keycloak-connect'; // Decoradores útiles

@Controller('message')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // 1. Endpoint READ
  // Controla quienes pueden hacer lectura del mensaje para este ejemplo
  // Los perfiles habilitados se establecen mediante la propiedad 'roles' del decorador @Roles
  @Get('read')
  @Roles({ roles: ['realm:administrator-global', 'realm:consultor-global'] })
  getMessage() {
    return { message: 'Mensaje leído exitosamente' };
  }

  // 2. Endpoint WRITE
  // Controla quienes pueden hacer escritura del mensaje para este ejemplo
  // Los perfiles habilitados se establecen mediante la propiedad 'roles' del decorador @Roles
  @Get('write')
  @Roles({ roles: ['realm:administrator-global', 'realm:developer-global'] })
  writeMessage() {
    return { mesage: 'Mensaje escrito exitosamente' };
  }
}
