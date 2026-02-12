// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(username: string, password: string): Promise<any> {
    const keycloakUrl = `${process.env.KEYCLOAK_AUTH_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    console.log(keycloakUrl);

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', String(process.env.KEYCLOAK_CLIENT_ID));
    params.append('client_secret', String(process.env.KEYCLOAK_SECRET));
    params.append('username', username);
    params.append('password', password);

    try {
      console.log(`URL: ${keycloakUrl}`);
      const response = await lastValueFrom(
        this.httpService.post(keycloakUrl, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
      // Retornamos el token de acceso
      return response.data;
    } catch (error) {
      console.log(`Ocurrió un error: ${error}`);
      throw new UnauthorizedException(
        'Credenciales inválidas o error en Keycloak',
      );
    }
  }
}
