import { Expose, Transform, Type, TransformFnParams } from 'class-transformer';
import { GetAuthResponseDto } from 'src/auth/dto/get-auth-response.dto';
import { DivisiResponseDto } from 'src/divisi/dto/divisi-response.dto';
export class GetUserDto {
  @Expose()
  user_id: number;

  @Expose()
  userID: string;

  @Expose()
  role: string;

  @Expose()
  gender: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  deleted_at: Date;

  @Expose()
  @Type(() => GetAuthResponseDto)
  auth: GetAuthResponseDto;

  @Expose()
  @Type(() => DivisiResponseDto)
  divisi: DivisiResponseDto | null;
}
