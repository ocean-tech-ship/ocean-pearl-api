import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AirtableUrlBuilder } from '../builder/airtable-url.builder';

const tableName = 'Funding Rounds';

@Injectable()
export class RoundsProvider {
    public constructor(
        private httpService: HttpService,
        private airtableUrlBuilder: AirtableUrlBuilder,
        private configService: ConfigService,
    ) {}

    public fetch(query: any = null): Promise<AxiosResponse<any>> {
        const config = {
            headers: {
                Authorization: `Bearer ${this.configService.get<string>(
                    'AIRTABLE_API_KEY',
                )}`,
            },
        } as AxiosRequestConfig;
        const apiUrl = this.airtableUrlBuilder.build(tableName, query);

        return this.httpService.get(apiUrl, config).toPromise();
    }
}
