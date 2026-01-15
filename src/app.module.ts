// src/app.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    HttpModule, // Necesario para hacer el post a Keycloak
    // Configuración de la librería de protección
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:7080', // Mapear URL del archivo .env
      realm: 'demo-realm', // Mapear realm del archivo .env
      clientId: 'nest-app', // Mapear client_id del archivo .env
      secret: '0JIajE558dQxcTvgG9ZjDnmMgTBR06TD', // Mapear secret del archivo .env
      // Validación básica
      cookieKey: 'KEYCLOAK_JWT',
      logLevels: ['verbose'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AuthService,
    // Este Guard protege TODAS las rutas por defecto a menos que se use @Public()
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Opcional: Para validar roles
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
