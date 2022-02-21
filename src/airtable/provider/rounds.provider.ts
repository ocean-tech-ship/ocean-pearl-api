import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AirtableUrlBuilder } from '../builder/airtable-url.builder';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

const tableName = 'Funding Rounds';

@Injectable()
export class RoundsProvider {
    public constructor(
        private httpService: HttpService,
        private airtableUrlBuilder: AirtableUrlBuilder,
        private configService: ConfigService,
    ) {}

    public fetch(query: any = null): Promise<AxiosResponse> {
        const config = {
            headers: {
                Authorization: `Bearer ${this.configService.get<string>('AIRTABLE_API_KEY')}`,
            },
        } as AxiosRequestConfig;
        const apiUrl = this.airtableUrlBuilder.build(tableName, query);

        return <Promise<AxiosResponse>>lastValueFrom(this.httpService.get(apiUrl, config));
    }
}
