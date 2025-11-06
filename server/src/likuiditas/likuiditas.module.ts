import { Module } from '@nestjs/common';
import { LikuiditasService } from './likuiditas.service';
import { LikuiditasController } from './likuiditas.controller';

@Module({
  controllers: [LikuiditasController],
  providers: [LikuiditasService],
})
export class LikuiditasModule {}
