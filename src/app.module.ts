import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { FileModule } from './modules/file';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
