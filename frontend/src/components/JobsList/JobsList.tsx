import React, { useCallback, useEffect, type FC } from "react";
import SimpleBar from "simplebar-react";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  isJobsLoadingSelector,
  jobsSelector,
  setActiveJobId,
} from "../../store/slices/job-slice";
import type { TypedDispatch } from "../../store/store";
import JobsItem from "../JobsItem/JobsItem";

const JobsList: FC = () => {
  const dispatch = useDispatch<TypedDispatch>();

  const jobsList = useSelector(jobsSelector);
  const isJobsLoading = useSelector(isJobsLoadingSelector);

  useEffect(() => {
    dispatch(fetchJobs());
  }, []);

  const clickJobCardHandler = useCallback((id: string) => {
    dispatch(setActiveJobId(id));
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-50 p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-4 shrink-0">Job's list</h1>
      {!isJobsLoading ? (
        <SimpleBar className="flex-1 min-h-0" autoHide={false}>
          <div className="grid grid-cols-2 gap-3 items-start pr-3">
            {jobsList.map((job) => (
              <JobsItem 
                key={job.id} 
                job={job} 
                clickJobCardHandler={clickJobCardHandler} 
              />
            ))}
          </div>
        </SimpleBar>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-indigo-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default JobsList;
