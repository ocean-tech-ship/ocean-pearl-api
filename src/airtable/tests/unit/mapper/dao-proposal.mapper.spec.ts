import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { DaoProposalStatusEnum } from '../../../../database/enums/dao-proposal-status.enum';
import { FundamentalMetricEnum } from '../../../../database/enums/fundamental-metric.enum';
import { StandingEnum } from '../../../../database/enums/standing.enum';
import { DaoProposalMapper } from '../../../mapper/dao-proposal.mapper';
import { faker } from '@faker-js/faker';

const AIRTABLE_ID = faker.datatype.hexaDecimal(10);
const ROUND_ID = new Types.ObjectId(faker.datatype.hexaDecimal(10));

const airtableData = {
    'Project Name': 'Test',
    'Proposal State': 'Running',
    'Grant Category': 'DAO',
    'One Liner': 'Test Project One Liner',
    'Overview': 'Test Project Overview',
    'Proposal Standing': 'Completed',
    'Wallet Address': faker.datatype.hexaDecimal(42),
    'Fundamental Metric': 'MVP Launch',
    'OCEAN Requested': '10000',
    'OCEAN Granted': '10000',
    'USD Requested': '8400',
    'USD Granted': '8400',
    'Proposal URL': faker.internet.url(),
    'Snapshot Block': faker.datatype.hexaDecimal(10),
    'ipfsHash': faker.datatype.number(10),
    'Voted Yes': '4200000',
    'Voted No': '420',
    'Created Date': faker.date.past(),
};

describe('DaoProposalMapper', () => {
    let service: DaoProposalMapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DaoProposalMapper],
        }).compile();

        service = module.get<DaoProposalMapper>(DaoProposalMapper);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should map correctly', () => {
        expect(service.map(airtableData, AIRTABLE_ID, ROUND_ID)).toEqual({
            airtableId: AIRTABLE_ID,
            category: CategoryEnum.DAO,
            noVotes: 420,
            createdAt: airtableData['Created Date'],
            deliverables: [],
            description: 'Test Project Overview',
            earmark: undefined,
            fundamentalMetric: FundamentalMetricEnum.MvpLaunch,
            fundingRound: ROUND_ID,
            receivedFunding: {
                usd: 8400,
                ocean: 10000,
            },
            ipfsHash: airtableData['ipfsHash'],
            oceanProtocolPortUrl: airtableData['Proposal URL'],
            oneLiner: 'Test Project One Liner',
            requestedFunding: {
                usd: 8400,
                ocean: 10000,
            },
            snapshotBlock: airtableData['Snapshot Block'],
            standing: StandingEnum.Completed,
            status: DaoProposalStatusEnum.Running,
            title: 'Test',
            voteUrl: '',
            yesVotes: 4200000,
            walletAddress: airtableData['Wallet Address'].toLowerCase(),
        });
    });

    it('should use "received ocean" for the "requested ocean" value', () => {
        airtableData['OCEAN Requested'] = '0';

        expect(
            service.map(airtableData, AIRTABLE_ID, ROUND_ID).requestedFunding.ocean,
        ).toEqual(10000);
    });
});
