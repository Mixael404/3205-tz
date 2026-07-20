export const JOB_STATUSES = ["pending", "in_progress", "completed", "cancelled", "failed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];
type UrlStatus = "pending" | "in_progress" | "success" | "error" | "cancelled";

export interface Job {
    jobId: string;
    status: JobStatus;
    createdAt: Date;
    urls: Url[];
}

export interface Url {
    url: string;
    status: UrlStatus;
    httpStatusCode?: number;
    errorMessage?: string;
    processStart?: Date;
    processFinish?: Date;
    processDuration?: number;
}
