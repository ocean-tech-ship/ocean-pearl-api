import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CategoryEnum } from '../../../../database/enums/category.enum';
import { DaoProposalStatusEnum } from '../../../../database/enums/dao-proposal-status.enum';
import { FundamentalMetricEnum } from '../../../../database/enums/fundamental-metric.enum';
import { StandingEnum } from '../../../../database/enums/standing.enum';
import { DaoProposal } from '../../../../database/schemas/dao-proposal.schema';
import { DaoProposalMapper } from '../../../mapper/dao-proposal.mapper';

const faker = require('faker');
const AIRTABLE_ID = faker.datatype.hexaDecimal(10);
const ROUND_ID = Types.ObjectId(faker.datatype.hexaDecimal(10));

let airtableData = {
    'Project Name': 'Test',
    'Proposal State': 'Running',
    'Grant Category': 'DAO',
    'One Liner': 'Test Project One Liner',
    'Overview': 'Test Project Overview',
    'Proposal Standing': 'Completed',
    'Wallet Address': faker.datatype.hexaDecimal(64),
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
            counterVotes: 420,
            createdAt: airtableData['Created Date'],
            deliverables: [],
            description: 'Test Project Overview',
            fundamentalMetric: FundamentalMetricEnum.MvpLaunch,
            fundingRound: ROUND_ID,
            grantedToken: 10000,
            grantedUsd: 8400,
            ipfsHash: airtableData['ipfsHash'],
            oceanProtocolPortUrl: airtableData['Proposal URL'],
            oneLiner: 'Test Project One Liner',
            requestedGrantToken: 10000,
            requestedGrantUsd: 8400,
            snapshotBlock: airtableData['Snapshot Block'],
            standing: StandingEnum.Completed,
            status: DaoProposalStatusEnum.Running,
            title: 'Test',
            votes: 4200000,
            walletAddress: airtableData['Wallet Address'],
        });
    });

    it('should use "grantedToken" for the "requestedToken" propoerty', () => {
        airtableData['OCEAN Requested'] = '0';

        expect(
            service.map(airtableData, AIRTABLE_ID, ROUND_ID).requestedGrantToken,
        ).toEqual(10000);
    });
});
