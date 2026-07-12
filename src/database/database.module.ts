import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService) => ({
                uri: configService.get('MONGODB_URI') as string,
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule, DatabaseService],
    controllers: [DatabaseController],
    providers: [DatabaseService],
})

export class DatabaseModule {}