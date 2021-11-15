import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryEnum } from '../../database/enums/category.enum';
import { FundamentalMetricEnum } from '../../database/enums/fundamental-metric.enum';
import { StandingEnum } from '../../database/enums/standing.enum';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { CategoryMap } from '../constants/category-map.constant';
import { EarmarkTypeMap } from '../constants/earmark-type-map.constant';
import { FundamentalMetricsMap } from '../constants/fundamental-metrics-map.constant';
import { StandingMap } from '../constants/standing-map.constant';
import { StatesMap } from '../constants/states-map.constant';

@Injectable()
export class DaoProposalMapper {
    public map(
        airtableData: any,
        airtableId: string,
        roundId: Types.ObjectId,
    ): DaoProposal {
        const mappedProposal: DaoProposal = {
            airtableId: airtableId,
            title: airtableData['Project Name']?.trim(),
            status: StatesMap[airtableData['Proposal State']],
            fundingRound: roundId,
            category:
                CategoryMap[airtableData['Grant Category']?.trim()] ??
                CategoryEnum.Other,
            earmark: airtableData['Earmarks']
                ? EarmarkTypeMap[airtableData['Earmarks']?.trim()]
                : undefined,
            oneLiner: airtableData['One Liner'],
            description: airtableData['Overview'],
            standing:
                StandingMap[airtableData['Proposal Standing']] ??
                StandingEnum.Unreported,
            walletAddress: airtableData['Wallet Address'].toLowerCase(),
            fundamentalMetric:
                FundamentalMetricsMap[airtableData['Fundamental Metric']] ??
                FundamentalMetricEnum.Other,
            requestedGrantToken: airtableData['OCEAN Requested']
                ? parseInt(airtableData['OCEAN Requested'])
                : 0,
            grantedToken: airtableData['OCEAN Granted']
                ? parseInt(airtableData['OCEAN Granted'])
                : 0,
            requestedGrantUsd: airtableData['USD Requested']
                ? parseInt(airtableData['USD Requested'])
                : 0,
            grantedUsd: airtableData['USD Granted']
                ? parseInt(airtableData['USD Granted'])
                : 0,
            oceanProtocolPortUrl: airtableData['Proposal URL'] ?? '',
            snapshotBlock: airtableData['Snapshot Block'],
            ipfsHash: airtableData['ipfsHash'],
            votes: airtableData['Voted Yes']
                ? Math.floor(airtableData['Voted Yes'] as number)
                : 0,
            counterVotes: airtableData['Voted No']
                ? Math.floor(airtableData['Voted No'] as number)
                : 0,
            voteUrl: airtableData['Vote URL'] ?? '',
            deliverables: [],
            createdAt: new Date(airtableData['Created Date']),
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
