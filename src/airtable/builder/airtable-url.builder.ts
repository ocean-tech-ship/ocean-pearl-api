import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const SEARCH_QUERY_STRING = '?filterByFormula=';

@Injectable()
export class AirtableUrlBuilder {
    public constructor(private configService: ConfigService) {}

    public build(table: string, query: any = null): string {
        let baseUrl: string =
            this.configService.get<string>('AIRTABLE_URL') + table;

        if (query === null) {
            return baseUrl;
        }

        const searchQuery: string = this.buildSearchQuery(query);

        return baseUrl + searchQuery;
    }

    private buildSearchQuery(query: any): string {
        let searchQuery: string = '';

        for (let [key, value] of Object.entries(query)) {
            searchQuery += `{${key}}=${value}`;
        }

        return SEARCH_QUERY_STRING + escape(searchQuery);
    }
}
