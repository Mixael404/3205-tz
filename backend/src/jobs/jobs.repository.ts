import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";

import { CreateJobDto } from "./dto";
import { IJob, JobStatus, IUrl } from "./jobs.interface";

@Injectable()
export class JobsRepository {
    private jobs: IJob[] = [];

    create(job: CreateJobDto): Pick<IJob, "jobId"> {
        const id = randomUUID();

        if (this.jobs.some((existingJob) => existingJob.jobId === id)) {
            throw new InternalServerErrorException("Job id collision, please retry");
        }

        const urls: IUrl[] = job.urls.map((url) => ({
            url,
            status: "pending",
        }));

        const newJob: IJob = {
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

    findAll(): IJob[] {
        return this.jobs;
    }

    findPending(): IJob[] {
        return this.jobs.filter((job) => job.status === "pending");
    }

    findById(id: string): IJob {
        const foundJob = this.jobs.find((job) => job.jobId === id);
        if (!foundJob) throw new NotFoundException("Job not found");
        return foundJob;
    }

    updateStatus(id: string, status: JobStatus) {
        const foundJob = this.findById(id);
        foundJob.status = status;
        return foundJob.jobId;
    }

    update(id: string, job: Partial<IJob>) {
        const foundJob = this.findById(id);
        Object.assign(foundJob, job);
        return foundJob.jobId;
    }
}
