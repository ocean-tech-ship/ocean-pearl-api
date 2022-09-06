import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Connection, Model } from 'mongoose';
import { MigrationStatusEnum } from '../enums/migration-status.enum';
import { MigrationInterface } from '../interfaces/migration.interface';
import { Migration } from '../schemas/migration.schema';

export class MigrationService implements OnModuleInit {
    private readonly logger = new Logger(MigrationService.name);
    private migrations: MigrationInterface[] = [];

    public constructor(@InjectConnection() private connection: Connection) {}

    public async onModuleInit(): Promise<void> {
        await this.initMigrations();
        await this.up();
        await this.down();
    }

    public async up(): Promise<void> {
        this.logger.log('Starting Migrations Up.');
        const migrationModel = this.connection.model<Migration>('Migration');

        this.migrations.sort(
            (current: MigrationInterface, next: MigrationInterface) =>
                current.getVersion() - next.getVersion(),
        );

        try {
            for (const migration of this.migrations) {
                if (
                    await migrationModel.exists({
                        version: migration.getVersion(),
                        status: {
                            $in: [
                                MigrationStatusEnum.Revert,
                                MigrationStatusEnum.Down,
                                MigrationStatusEnum.Up,
                            ],
                        },
                    })
                ) {
                    continue;
                }

                await migration.up(this.connection);
                await migrationModel.findOneAndUpdate(
                    { version: migration.getVersion() },
                    {
                        version: migration.getVersion(),
                        status: MigrationStatusEnum.Up,
                    } as Migration,
                    { upsert: true },
                );

                this.logger.log(`Migration ${migration.getVersion()} UP finished.`);
            }
        } catch (error) {
            throw error;
        }

        this.logger.log('Finished Migrations Up.');
    }

    @Cron(CronExpression.EVERY_HOUR, {
        name: 'Migration revert',
        timeZone: 'Europe/Berlin',
    })
    public async down(): Promise<void> {
        this.logger.log('Starting Migrations Down.');
        const migrationModel: Model<any> = this.connection.model('Migration');

        try {
            for (const migration of this.migrations) {
                if (
                    !(await migrationModel.exists({
                        version: migration.getVersion(),
                        status: MigrationStatusEnum.Revert,
                    }))
                ) {
                    continue;
                }

                await migration.down(this.connection);
                await migrationModel.updateOne({
                    version: migration.getVersion(),
                    status: MigrationStatusEnum.Down,
                } as Migration);

                this.logger.log(`Migration ${migration.getVersion()} DOWN finished.`);
            }
        } catch (error) {
            throw error;
        }

        this.logger.log('Finished Migrations Down.');
    }

    private async initMigrations(): Promise<void> {
        const path = require('path');
        const fs = require('fs');
        const directoryPath = path.join(__dirname, '../migrations/');

        const files = fs.readdirSync(directoryPath).filter((file: any) => file.endsWith('.js'));

        for (const file of files) {
            const migration = await import(directoryPath + file);
            this.migrations.push(new migration.default());
        }
    }
}
