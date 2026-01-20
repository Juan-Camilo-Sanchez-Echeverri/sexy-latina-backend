import { ValidationErrorItem } from '../interfaces/validation-error.interface';

export class ErrorsResponse {
  error: string;
  code: number | null = null;
  path: string;
  status: number;
  details: ValidationErrorItem[] = [];
}
