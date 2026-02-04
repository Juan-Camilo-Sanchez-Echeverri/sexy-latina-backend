import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class SocialLinks {
  @Prop({ type: String, default: null })
  instagram: string | null;

  @Prop({ type: String, default: null })
  twitter: string | null;
}

export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);
