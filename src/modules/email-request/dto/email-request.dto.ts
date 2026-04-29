import type { TypeRequest } from '../types/type-request';

export class EmailRequestDto {
  email: string;
  name: string;
  type: TypeRequest;
  expiresIn: Date;
}
