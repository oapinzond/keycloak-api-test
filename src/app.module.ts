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
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule, // Necesario para hacer el post a Keycloak
    // Configuración de la librería de protección
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: String(process.env.KEYCLOAK_SECRET),
      // Validación básica
      cookieKey: 'KEYCLOAK_JWT',
      logLevels: ['verbose'],
    }),
  ],
  controllers: [AuthController, AppController],
  providers: [
    AuthService,
    // Este Guard protege TODAS las rutas por defecto a menos que se use @Public()
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Opcional: Usa metadatos de resursos
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // Verifica los roles del usuario
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
