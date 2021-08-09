import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiResponse({ status: 301, description: 'Redirect to OpenApi docs'})
    @Redirect('/api', 301)
    public showSwaggerDocs(): void {}
}
