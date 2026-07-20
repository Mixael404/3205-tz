import { Injectable } from "@nestjs/common";

import { CreateJobDto } from "./dto";
import { JobsRepository } from "./jobs.repository";

@Injectable()
export class JobsService {
    constructor(private readonly jobsRepository: JobsRepository) {}

    createJob(data: CreateJobDto) {
        return this.jobsRepository.create(data);
    }

    getAllJobs() {
        return this.jobsRepository.findAll();
    }

    getJobById(id: string) {
        return this.jobsRepository.findById(id);
    }

    deleteJob(id: string) {
        return this.jobsRepository.updateStatus(id, "cancelled");
    }
}
