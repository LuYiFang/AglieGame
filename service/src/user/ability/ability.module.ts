import { Module } from '@nestjs/common';
import { AbilityService } from './ability.service';
import { AbilityController } from './ability.controller';
import { UserModule } from '../user.module';

@Module({
  imports: [UserModule],
  controllers: [AbilityController],
  providers: [AbilityService],
})
export class AbilityModule {}
