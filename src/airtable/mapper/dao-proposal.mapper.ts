import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryEnum } from '../../database/enums/category.enum';
import { FundamentalMetricEnum } from '../../database/enums/fundamental-metric.enum';
import { StandingEnum } from '../../database/enums/standing.enum';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';
import { Funding } from '../../database/schemas/funding.schema';
import { CategoryMap } from '../constants/category-map.constant';
import { EarmarkTypeMap } from '../constants/earmark-type-map.constant';
import { FundamentalMetricsMap } from '../constants/fundamental-metrics-map.constant';
import { StandingMap } from '../constants/standing-map.constant';
import { StatesMap } from '../constants/states-map.constant';

@Injectable()
export class DaoProposalMapper {
    public map(airtableData: any, airtableId: string, roundId: Types.ObjectId): DaoProposal {
        const mappedProposal: DaoProposal = new DaoProposal({
            airtableId: airtableId,
            title: airtableData['Project Name']?.trim(),
            status: StatesMap[airtableData['Proposal State']],
            fundingRound: roundId,
            category: CategoryMap[airtableData['Grant Category']?.trim()] ?? CategoryEnum.Other,
            earmark: airtableData['Earmarks']
                ? EarmarkTypeMap[airtableData['Earmarks']?.trim()]
                : undefined,
            oneLiner: airtableData['One Liner'],
            description: airtableData['Overview'],
            standing: StandingMap[airtableData['Proposal Standing']] ?? StandingEnum.Unreported,
            author: airtableData['Wallet Address'],
            fundamentalMetric:
                FundamentalMetricsMap[airtableData['Fundamental Metric']] ??
                FundamentalMetricEnum.Other,
            requestedFunding: new Funding({
                usd: airtableData['USD Requested'] ? airtableData['USD Requested'] : 0,
                ocean: airtableData['OCEAN Requested'] ? airtableData['OCEAN Requested'] : 0,
            }),
            minimumRequestedFunding: new Funding({
                usd: airtableData['Minimum USD Requested']
                    ? airtableData['Minimum USD Requested']
                    : 0,
                ocean: airtableData['Minimum OCEAN Requested']
                    ? airtableData['Minimum OCEAN Requested']
                    : 0,
            }),
            receivedFunding: new Funding({
                usd: airtableData['USD Granted'] ? airtableData['USD Granted'] : 0,
                ocean: airtableData['OCEAN Granted'] ? airtableData['OCEAN Granted'] : 0,
            }),
            oceanProtocolPortUrl: airtableData['Proposal URL'] ?? '',
            snapshotBlock: airtableData['Snapshot Block'],
            ipfsHash: airtableData['ipfsHash'],
            yesVotes: airtableData['Voted Yes']
                ? Math.floor(parseInt(airtableData['Voted Yes']))
                : 0,
            noVotes: airtableData['Voted No'] ? Math.floor(parseInt(airtableData['Voted No'])) : 0,
            voteUrl: airtableData['Vote URL'] ?? '',
            deliverables: [],
            createdAt: new Date(airtableData['Created Date']),
        });

        if (
            mappedProposal.requestedFunding.ocean === 0 &&
            mappedProposal.receivedFunding.ocean > 0
        ) {
            mappedProposal.requestedFunding.ocean = mappedProposal.receivedFunding.ocean;
        }

        if (mappedProposal.requestedFunding.usd === 0 && mappedProposal.receivedFunding.usd > 0) {
            mappedProposal.requestedFunding.usd = mappedProposal.receivedFunding.usd;
        }

        return mappedProposal;
    }
}
