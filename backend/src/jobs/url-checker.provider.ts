import { Injectable } from "@nestjs/common";

interface CheckUrlResult {
    httpCode: number;
    errorMessage?: string;
}

@Injectable()
export class UrlChecker {
    async check(url: string): Promise<CheckUrlResult> {
        try {
            const res = await fetch(url, { method: "HEAD" });

            if (res.ok) {
                return { httpCode: res.status };
            }

            return {
                httpCode: res.status,
                errorMessage: res.statusText,
            };
        } catch (err) {
            return {
                httpCode: 500,
                errorMessage: err instanceof Error ? err.message : String(err),
            };
        }
    }
}
