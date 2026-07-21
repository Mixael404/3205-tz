import { Injectable, OnModuleInit } from "@nestjs/common";

import { IUrl } from "./jobs.interface";
import { JobsRepository } from "./jobs.repository";
import { UrlChecker } from "./url-checker.provider";

@Injectable()
export class JobProcessor implements OnModuleInit {
    private readonly URL_CONCURRENCY = 5;
    private readonly JOB_CUNCURRENCY = 2;
    private readonly ACTIVE_JOBS = new Set<string>();
    private readonly POLL_INTERVAL = 1000;
    private readonly MAX_DELAY = 10000;

    constructor(
        private readonly jobsRepository: JobsRepository,
        private readonly urlCheckerService: UrlChecker
    ) {}

    onModuleInit() {
        setInterval(() => this.tick(), this.POLL_INTERVAL);
    }

    private tick() {
        const pendingJobs = this.jobsRepository.findPending();

        for (const job of pendingJobs) {
            if (this.ACTIVE_JOBS.size >= this.JOB_CUNCURRENCY) break;
            if (this.ACTIVE_JOBS.has(job.jobId)) continue;

            this.ACTIVE_JOBS.add(job.jobId);
            this.processJob(job.jobId).finally(() => this.ACTIVE_JOBS.delete(job.jobId));
        }
    }

    async processJob(jobId: string) {
        const job = this.jobsRepository.findById(jobId);
        this.jobsRepository.updateStatus(jobId, "in_progress");

        let nextIndex = 0;

        const worker = async () => {
            while (true) {
                if (job.status === "cancelled") {
                    job.urls.filter((url) => url.status === "pending").forEach((url) => (url.status = "cancelled"));
                    return;
                }

                const index = nextIndex++;
                if (index >= job.urls.length) return;

                await this.checkUrl(job.urls[index]);
            }
        };

        const workersCount = Math.min(this.URL_CONCURRENCY, job.urls.length);
        await Promise.all(Array.from({ length: workersCount }, () => worker()));

        if (job.status === "cancelled") return;

        const hasError = job.urls.some((url) => url.status === "error");
        this.jobsRepository.update(jobId, { status: hasError ? "failed" : "completed" });
    }

    private async checkUrl(url: IUrl) {
        const start = Date.now();

        Object.assign(url, {
            status: "in_progress",
            processStart: start,
        });
        const result = await this.urlCheckerService.check(url.url);

        const delayMs = Math.random() * this.MAX_DELAY;
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        const finish = Date.now();
        const duration = finish - start;

        Object.assign(url, {
            httpStatusCode: result.httpCode,
            errorMessage: result.errorMessage,
            status: result.errorMessage ? "error" : "success",
            processEnd: finish,
            duration,
        });
    }
}
