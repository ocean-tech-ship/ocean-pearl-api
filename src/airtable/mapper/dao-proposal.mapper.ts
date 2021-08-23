import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryEnum } from '../../database/enums/category.enum';
import { StandingEnum } from '../../database/enums/standing.enum';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { CategoryMap } from '../constants/category-map.constant';
import { FundamentalMetricsMap } from '../constants/fundamental-metrics-map.constant';
import { StandingMap } from '../constants/standing-map.constant';
import { StatesMap } from '../constants/states-map.constant';

@Injectable()
export class DaoProposalMapper {
    public map(
        aritableData: any,
        airtableId: string,
        roundId: Types.ObjectId,
    ): DaoProposal {
        let mappedProposal: DaoProposal = {
            airtableId: airtableId,
            title: aritableData['Project Name'].trim(),
            status: StatesMap[aritableData['Proposal State']],
            fundingRound: roundId,
            category:
                CategoryMap[aritableData['Grant Category'].trim()] ??
                CategoryEnum.Other,
            oneLiner: aritableData['One Liner'],
            description: aritableData['Overview'],
            standing:
                StandingMap[aritableData['Proposal Standing']] ??
                StandingEnum.Unreported,
            walletAddress: aritableData['Wallet Address'].toLowerCase(),
            fundamentalMetric:
                FundamentalMetricsMap[aritableData['Fundamental Metric']],
            requestedGrantToken: aritableData['OCEAN Requested']
                ? parseInt(aritableData['OCEAN Requested'])
                : 0,
            grantedToken: aritableData['OCEAN Granted']
                ? parseInt(aritableData['OCEAN Granted'])
                : 0,
            requestedGrantUsd: aritableData['USD Requested']
                ? parseInt(aritableData['USD Requested'])
                : 0,
            grantedUsd: aritableData['USD Granted']
                ? parseInt(aritableData['USD Granted'])
                : 0,
            oceanProtocolPortUrl: aritableData['Proposal URL'] ?? '',
            snapshotBlock: aritableData['Snapshot Block'],
            ipfsHash: aritableData['ipfsHash'],
            votes: aritableData['Voted Yes']
                ? Math.floor(aritableData['Voted Yes'] as number)
                : 0,
            counterVotes: aritableData['Voted No']
                ? Math.floor(aritableData['Voted No'] as number)
                : 0,
            deliverables: [],
            createdAt: new Date(aritableData['Created Date']),
        } as DaoProposal;

        if (
            mappedProposal.requestedGrantToken === 0 &&
            mappedProposal.grantedToken > 0
        ) {
            mappedProposal.requestedGrantToken = mappedProposal.grantedToken;
        }

        if (
            mappedProposal.requestedGrantUsd === 0 &&
            mappedProposal.grantedUsd > 0
        ) {
            mappedProposal.requestedGrantUsd = mappedProposal.grantedUsd;
        }

        return mappedProposal;
    }
}
