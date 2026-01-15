// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(username: string, password: string): Promise<any> {
    const keycloakUrl = `http://localhost:7080/realms/demo-realm/protocol/openid-connect/token`; // Mapear datos de la URL del archivo .env

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'nest-app'); // Mapear client_id del archivo .env
    params.append('client_secret', '0JIajE558dQxcTvgG9ZjDnmMgTBR06TD'); // Mapear secret del archivo .env
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
