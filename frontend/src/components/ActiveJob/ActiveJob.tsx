import { useEffect, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import { Ban, ListTodo, Loader2 } from "lucide-react";

import {
  activeJobIdSelector,
  activeJobSelector,
  cancelJob,
  fetchJobDetails,
  isCancellingActiveJobSelector,
} from "../../store/slices/job-slice";
import type { TypedDispatch } from "../../store/store";

import UrlRow from "../UrlRow/UrlRow";

import styles from "./ActiveJob.module.scss";

const ActiveJob: FC = () => {
  const dispatch = useDispatch<TypedDispatch>();
  const activeJobId = useSelector(activeJobIdSelector);
  const activeJob = useSelector(activeJobSelector);
  const isCancellingActiveJob = useSelector(isCancellingActiveJobSelector);

  useEffect(() => {
    if (!activeJobId) return;
    dispatch(fetchJobDetails(activeJobId));
  }, [activeJobId, dispatch]);

  useEffect(() => {
    if (!activeJobId || !activeJob) return;

    const hasUrlsInProgress = activeJob.urls.some(
      (url) => url.status === "in_progress",
    );

    const isActive =
      activeJob.status === "pending" ||
      activeJob.status === "in_progress" ||
      (activeJob.status === "cancelled" && hasUrlsInProgress);

    if (!isActive) return;

    const intervalId = setInterval(() => {
      dispatch(fetchJobDetails(activeJobId));
    }, 2000);

    return () => clearInterval(intervalId);
  }, [activeJobId, activeJob, activeJob?.status, dispatch]);

  if (!activeJobId || !activeJob) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
        <ListTodo size={28} />
        <span className="text-sm">Select a job to see details</span>
      </div>
    );
  }

  const total = activeJob.urls.length;

  const cancelledCount = activeJob.urls.filter(
    (url) => url.status === "cancelled",
  ).length;

  const success = activeJob.urls.filter(
    (url) => url.status === "success",
  ).length;

  const failed = activeJob.urls.filter(
    (url) => url.status === "error"
  ).length;

  const processed = success + failed + cancelledCount;

  const successPercent = total > 0 ? (success / total) * 100 : 0;
  const failedPercent = total > 0 ? (failed / total) * 100 : 0;
  const cancelledPercent = total > 0 ? (cancelledCount / total) * 100 : 0;

  const isCancellable =
    activeJob.status === "pending" || activeJob.status === "in_progress";

  const cancelJobHandler = () => {
    dispatch(cancelJob(activeJob.jobId));
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">Active job</h2>
        <span className="text-sm font-mono text-slate-500">{activeJob.jobId}</span>
        <span
          className={`${styles["badge"]} ${styles[`badge--${activeJob.status}`]}`}
        >
          {activeJob.status}
        </span>
        {isCancellable && (
          <button
            type="button"
            onClick={cancelJobHandler}
            disabled={isCancellingActiveJob}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCancellingActiveJob ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Ban size={14} />
            )}
            Cancel
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            {processed} from {total} processed
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-600 font-semibold">
              success: {success}
            </span>
            <span className="text-red-600 font-semibold">failed: {failed}</span>
            {cancelledCount > 0 && (
              <span className="text-slate-500 font-semibold">
                cancelled: {cancelledCount}
              </span>
            )}
          </div>
        </div>
        <div className={styles["progress"]}>
          <div className={styles["progress__bar"]}>
            <div
              className={styles["progress__segment--success"]}
              style={{ width: `${successPercent}%` }}
            />
            <div
              className={styles["progress__segment--failed"]}
              style={{ width: `${failedPercent}%` }}
            />
            <div
              className={styles["progress__segment--cancelled"]}
              style={{ width: `${cancelledPercent}%` }}
            />
          </div>
        </div>
      </div>

      <SimpleBar className="min-h-32 max-h-96" autoHide={false}>
        <div className="flex flex-col gap-2 pr-3 pb-1">
          {activeJob.urls.map((url, idx) => (
            <UrlRow key={`${url.url}-${idx}`} url={url} />
          ))}
        </div>
      </SimpleBar>
    </div>
  );
};

export default ActiveJob;
