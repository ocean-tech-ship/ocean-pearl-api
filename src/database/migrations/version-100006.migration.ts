import { Connection } from 'mongoose';
import { OriginEnum } from '../enums/origin.enum';
import { MigrationInterface } from '../interfaces/migration.interface';

export default class Version100006 implements MigrationInterface {
    public getVersion(): number {
        // count this number up with each migration
        return 100006;
    }

    public getDescription(): string {
        // add a short description of what will happen.
        return 'Set the origin for all previously created projects.';
    }

    public async up(connection: Connection): Promise<void> {
        // add the migration code here
        const projectModel = connection.model<any>('Project');
        const projects = await projectModel.find().lean();

        for (let project of projects) {
            project.origin = OriginEnum.OceanDao;

            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                },
                { strict: false },
            );
        }
    }

    public async down(connection: Connection): Promise<void> {
        // if possible add code that will revert the migration
        const projectModel = connection.model<any>('Project');
        const projects = await projectModel.find().lean();

        for (let project of projects) {
            delete project.origin;
            await projectModel.updateOne(
                { id: project.id },
                {
                    $set: project,
                    $unset: {
                        origin: 1,
                    },
                },
                { strict: false },
            );
        }
    }
}
