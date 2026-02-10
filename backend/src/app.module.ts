import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MdmModule } from './mdm/mdm.module';
import { FinanceModule } from './finance/finance.module';
import { DairyModule } from './dairy/dairy.module';
import { AgricultureModule } from './agriculture/agriculture.module';
import { InventoryModule } from './inventory/inventory.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ProcessingModule } from './processing/processing.module';
import { User } from './auth/entities/user.entity';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [User, __dirname + '/**/*.entity{.ts,.js}'],
                autoLoadEntities: true,
                synchronize: true, // Use migrations in production
                logging: configService.get('NODE_ENV') === 'development',
            }),
        }),

        // Feature modules
        AuthModule,
        MdmModule,
        FinanceModule,
        DairyModule,
        AgricultureModule,
        InventoryModule,
        WarehouseModule,
        ProcessingModule,
    ],
})
export class AppModule { }
