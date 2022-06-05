import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DaoProposal } from '../../database/schemas/dao-proposal.schema';

@Injectable()
export class GetFulltextProposalService {
    constructor(private httpService: HttpService) {}

    public async execute(proposal: DaoProposal): Promise<string | null> {
        const topicId = proposal.oceanProtocolPortUrl.split('/').pop();

        const topic = await lastValueFrom(
            this.httpService.get(`https://port.oceanprotocol.com/t/${topicId}.json`),
        );

        return topic.data?.post_stream?.posts[0]?.cooked;
    }
}
