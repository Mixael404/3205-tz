import { Module } from "@nestjs/common";

import { JobProcessor } from "./job-processor.provider";
import { JobsController } from "./jobs.controller";
import { JobsRepository } from "./jobs.repository";
import { JobsService } from "./jobs.service";
import { UrlChecker } from "./url-checker.provider";

@Module({
    controllers: [JobsController],
    providers: [JobsService, JobsRepository, UrlChecker, JobProcessor],
})
export class JobsModule {}
