import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { CreateJobDto, GetAllJobsResponse } from "./dto";
import { JobStatus } from "./jobs.interface";
import { JobsRepository } from "./jobs.repository";

@Injectable()
export class JobsService {
    constructor(private readonly jobsRepository: JobsRepository) {}

    createJob(data: CreateJobDto) {
        return this.jobsRepository.create(data);
    }

    getAllJobs(): GetAllJobsResponse[] {
        return this.jobsRepository.findAll().map((job) => ({
            id: job.jobId,
            createdAt: job.createdAt,
            status: job.status,
            urlsCount: job.urls.length,
            statistics: {
                success: job.urls.filter((url) => url.status === "success").length,
                failed: job.urls.filter((url) => url.status === "error").length,
            },
        }));
    }

    getJobById(id: string) {
        return this.jobsRepository.findById(id);
    }

    deleteJob(id: string) {
        const validStatusesToBeCancelled: JobStatus[] = ["pending", "in_progress"];
        const job = this.jobsRepository.findById(id);

        if (!job) throw new NotFoundException("Job doesn't found");
        if (!validStatusesToBeCancelled.includes(job.status))
            throw new BadRequestException("Job could not be cancelled");

        return this.jobsRepository.updateStatus(id, "cancelled");
    }
}
