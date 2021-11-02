import { Connection } from 'mongoose';

export interface MigrationInterface {
    getVersion(): number;
    getDescription(): string;
    up(connection: Connection): Promise<void>;
    down(connection: Connection): Promise<void>;
}