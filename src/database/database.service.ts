import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    async checkConnection() {
        return this.connection.readyState === 1;
    }
}

    