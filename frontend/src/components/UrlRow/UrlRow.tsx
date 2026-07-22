import type { FC } from "react";
import {
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

import type { IUrl } from "../../model/job";

import styles from "./UrlRow.module.scss";

const URL_STATUS_ICON: Record<
  IUrl["status"],
  FC<{ size?: number; className?: string }>
> = {
  pending: Clock,
  in_progress: Loader2,
  success: CheckCircle2,
  error: XCircle,
  cancelled: Ban,
};

const URL_STATUS_ICON_COLOR: Record<IUrl["status"], string> = {
  pending: "text-slate-400",
  in_progress: "text-blue-500",
  success: "text-emerald-500",
  error: "text-red-500",
  cancelled: "text-slate-400",
};

const httpCodeColorClass = (code?: number) => {
  if (!code) return "text-slate-500";
  if (code >= 200 && code < 300) return "text-emerald-600";
  if (code >= 300 && code < 400) return "text-amber-600";
  return "text-red-600";
};

interface IUrlRow {
    url: IUrl;
}

const UrlRow: FC<IUrlRow> = ({ url }) => {
  const Icon = URL_STATUS_ICON[url.status];

  return (
    <div className={`${styles["row"]} ${styles[`row--${url.status}`]}`}>
      <Icon
        size={16}
        className={`mt-0.5 shrink-0 ${URL_STATUS_ICON_COLOR[url.status]} ${
          url.status === "in_progress" ? styles["spin"] : ""
        }`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 truncate" title={url.url}>
            {url.url}
          </span>
          {url.httpStatusCode && (
            <span
              className={`text-xs font-mono font-semibold shrink-0 ${httpCodeColorClass(
                url.httpStatusCode,
              )}`}
            >
              {url.httpStatusCode}
            </span>
          )}
        </div>
        {url.errorMessage && (
          <div
            className="text-xs text-red-500 truncate"
            title={url.errorMessage}
          >
            {url.errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlRow;