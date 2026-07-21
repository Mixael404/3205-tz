import { Injectable } from "@nestjs/common";

import { CreateJobDto, GetAllJobsResponse } from "./dto";
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
        return this.jobsRepository.updateStatus(id, "cancelled");
    }
}
