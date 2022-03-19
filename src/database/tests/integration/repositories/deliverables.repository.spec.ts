import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from '../../../../app.module';
import { DatabaseModule } from '../../../database.module';
import { CategoryEnum } from '../../../enums/category.enum';
import { nanoid } from '../../../functions/nano-id.function';
import { DeliverableRepository } from '../../../repositories/deliverable.repository';
import { Deliverable } from '../../../schemas/deliverable.schema';

const DELIVERABLE_ID: string = nanoid();
const DELIVERABLE_MONGO_ID: Types.ObjectId = new Types.ObjectId();

describe('DeliverableRepository', () => {
    const deliverable: Deliverable = {
        _id: DELIVERABLE_MONGO_ID,
        id: DELIVERABLE_ID,
        title: 'The Title of the Deliverable',
        description: 'Here stands a description',
        delivered: false,
    } as Deliverable;

    let module: TestingModule;
    let service: DeliverableRepository;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DatabaseModule, AppModule],
        }).compile();

        service = module.get<DeliverableRepository>(DeliverableRepository);
    });

    afterAll(async () => {
        await service.delete({ find: { _id: DELIVERABLE_MONGO_ID } });
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Given I have a deliverable repository', () => {
        test('it should save a daoProposal', async () => {
            expect(await service.create(deliverable)).toEqual(
                DELIVERABLE_MONGO_ID,
            );
        });

        test('it should return a deliverable', async () => {
            const dbDeliverable = await service.getByID(deliverable.id);

            expect({
                id: dbDeliverable.id,
                title: dbDeliverable.title,
                description: dbDeliverable.description,
                delivered: dbDeliverable.delivered,
            }).toEqual({
                id: DELIVERABLE_ID,
                title: 'The Title of the Deliverable',
                description: 'Here stands a description',
                delivered: false,
            });
        });

        test('it should return all deliverables', async () => {
            expect((await service.getAll()).length).toBeGreaterThanOrEqual(1);
        });

        test('it should update a deliverable', async () => {
            deliverable.delivered = true;

            expect(await service.update(deliverable)).toBeTruthy();
        });

        test('it should delete a deliverable', async () => {
            expect(
                await service.delete({ find: { id: deliverable.id } }),
            ).toBeTruthy();
        });
    });
});
