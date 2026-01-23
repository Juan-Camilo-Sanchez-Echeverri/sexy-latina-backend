import type { TypeRequest } from '../types/type-request';

export class EmailRequestDto {
  email: string;
  firstName: string;
  type: TypeRequest;
  expiresIn: Date;
}
