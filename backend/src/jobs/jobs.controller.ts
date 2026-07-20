import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { CreateJobDto } from "./dto";
import { JobsService } from "./jobs.service";

@Controller("jobs")
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @ApiOperation({
        summary: "Create new job",
        description: "Creates new job with provided urls. Adds random id and status PENDING to a job",
    })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createJob(@Body() data: CreateJobDto) {
        return this.jobsService.createJob(data);
    }

    @ApiOperation({
        summary: "Get job by id",
        description: "Returns a single job by its id",
    })
    @Get(":id")
    @HttpCode(HttpStatus.OK)
    getJobById(@Param("id", ParseUUIDPipe) id: string) {
        return this.jobsService.getJobById(id);
    }

    @ApiOperation({
        summary: "Get all jobs",
        description:
            "Returnss list of all jobs including thier status, createAt, number of included urls and statistics",
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    getAllJobs() {
        return this.jobsService.getAllJobs();
    }

    @ApiOperation({
        summary: "Delete job",
        description: "Marks job as cancelled and cancels processing by its id",
    })
    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    deleteJob(@Param("id", ParseUUIDPipe) id: string) {
        return this.jobsService.deleteJob(id);
    }
}
