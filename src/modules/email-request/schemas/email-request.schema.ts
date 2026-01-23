import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class RequestType {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Date, required: true })
  expiresIn: Date;

  @Prop({ type: Number, default: 1 })
  attempts: number;

  @Prop({ type: Date, default: Date.now })
  lastAttemptAt: Date;
}

export const RequestTypeSchema = SchemaFactory.createForClass(RequestType);

@Schema({ timestamps: true, versionKey: false })
export class EmailRequest {
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ type: Map, of: RequestTypeSchema, default: {} })
  requests: Map<string, RequestType>;
}

export const EmailRequestSchema = SchemaFactory.createForClass(EmailRequest);
export type EmailRequestDocument = HydratedDocument<EmailRequest>;
