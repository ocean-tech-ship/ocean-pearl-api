import { Connection } from 'mongoose';
import { MigrationInterface } from '../interfaces/migration.interface';

export default class Version100001 implements MigrationInterface {
    public getVersion(): number {
        // Acount this number up with each migration
        return 100001;
    }

    public getDescription(): string {
        return 'Add a short description of what will happen.'
    }

    public async up(conntection: Connection): Promise<void> {
        // add the migration code here
    }

    public async down(conntection: Connection): Promise<void> {
        // if possible add code that will revert the migration
    }
}
