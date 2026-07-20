import { JobStatus } from "src/jobs/jobs.interface";

interface JobStatistics {
    success: number;
    failed: number;
}

export interface GetAllJobsResponse {
    id: string;
    createdAt: Date;
    status: JobStatus;
    urlsCount: number;
    statistics: JobStatistics;
}
