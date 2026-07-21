export const JOB_STATUSES = ["pending", "in_progress", "completed", "cancelled", "failed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];
type UrlStatus = "pending" | "in_progress" | "success" | "error" | "cancelled";

export interface IJobStatistics {
    success: number;
    failed: number;
}

export interface IJob {
    id: string;
    status: JobStatus;
    createdAt: Date;
    urls: IUrl[];
    statistics: IJobStatistics;
}

export interface IUrl {
    url: string;
    status: UrlStatus;
    httpStatusCode?: number;
    errorMessage?: string;
    processStart?: Date;
    processFinish?: Date;
    processDuration?: number;
}
