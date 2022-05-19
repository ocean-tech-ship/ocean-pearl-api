import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SyncProcessHealthService } from '../services/sync-process-health.service';

@ApiTags('airtable')
@Controller('airtable')
export class HealthController {
    constructor(private readonly syncProcessHealth: SyncProcessHealthService) {}

    @Get('status')
    @ApiOkResponse({
        description: 'Airtable syncing process is working properly',
    })
    @ApiInternalServerErrorResponse({
        description: 'Airtable syncing process is not working properly',
    })
    public async getStatus(@Res() res: Response) {
        return this.syncProcessHealth.isHealthy()
            ? res.status(200).send('Syncing process is working properly')
            : res.status(500).send('Syncing process is not working properly');
    }
}
