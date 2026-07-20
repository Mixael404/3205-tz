import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";

import { CreateJobDto, GetAllJobsResponse } from "./dto";
import { Job, JobStatus, Url } from "./jobs.interface";

@Injectable()
export class JobsRepository {
    private jobs: Job[] = [];

    create(job: CreateJobDto): Pick<Job, "jobId"> {
        const id = randomUUID();

        if (this.jobs.some((existingJob) => existingJob.jobId === id)) {
            throw new InternalServerErrorException("Job id collision, please retry");
        }

        const urls: Url[] = job.urls.map((url) => ({
            url,
            status: "pending",
        }));

        const newJob: Job = {
            jobId: id,
            status: "pending",
            createdAt: new Date(),
            urls,
        };

        this.jobs.push(newJob);

        const wasSaved = this.jobs.some((existingJob) => existingJob.jobId === id);

        if (!wasSaved) {
            throw new InternalServerErrorException("Failed to save job");
        }

        return { jobId: id };
    }

    findAll(): GetAllJobsResponse[] {
        return this.jobs.map((job) => ({
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

    findById(id: string): Job {
        const foundJob = this.jobs.find((job) => job.jobId === id);
        if (!foundJob) throw new NotFoundException("Job not found");
        return foundJob;
    }

    updateStatus(id: string, status: JobStatus) {
        const foundJob = this.findById(id);
        foundJob.status = status;
        return foundJob.jobId;
    }
}
