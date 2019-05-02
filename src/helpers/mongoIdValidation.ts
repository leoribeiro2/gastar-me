import { IsMongoId } from 'class-validator';

export class MongoIdValidation {
  @IsMongoId()
  id: string;
}
