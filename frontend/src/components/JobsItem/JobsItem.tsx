import React, { type FC } from "react";
import { Ban } from "lucide-react";

import type { IJob } from "../../model/job";

import styles from "./JobsItem.module.scss";

interface IJobsItem {
  job: IJob;
  clickJobCardHandler: (id: string) => void;
}

const JobsItem: FC<IJobsItem> = ({ job, clickJobCardHandler }) => {
  const { success, failed } = job.statistics;
  const total = success + failed;
  const successPercent = total > 0 ? (success / total) * 100 : 0;
  const failedPercent = total > 0 ? 100 - successPercent : 0;

  const setActiveJobId = () => clickJobCardHandler(job.id);

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log(job.id);
  };

  return (
    <div
      className="flex flex-col gap-2 p-3 bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
      onClick={setActiveJobId}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-slate-500 truncate">
          {job.id}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`${styles["badge"]} ${styles[`badge--${job.status}`]}`}
          >
            {job.status}
          </span>
          <button
            type="button"
            title="Cancel job"
            onClick={handleCancelClick}
            className="p-1 rounded text-red-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Ban size={14} />
          </button>
        </div>
      </div>
      <div className="text-sm text-slate-600">
        Created at: {new Date(job.createdAt).toLocaleString()}
      </div>
      <div className={`${styles["stats"]} pt-1 border-t border-slate-100`}>
        <span className={styles["stats__label--failed"]}>{failed}</span>
        <div className={styles["stats__bar"]}>
          <div
            className={styles["stats__bar-segment--failed"]}
            style={{ width: `${failedPercent}%` }}
          />
          <div
            className={styles["stats__bar-segment--success"]}
            style={{ width: `${successPercent}%` }}
          />
        </div>
        <span className={styles["stats__label--success"]}>{success}</span>
      </div>
    </div>
  );
};

export default React.memo(JobsItem);
