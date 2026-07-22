import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { IJob, IJobShort } from "../../model/job";
import type { RootState } from "../store";
import createHttpRequest from "../../api/axios";
import type { IAddJobRequest } from "../../model/add-job";

interface IInitialState {
  jobs: IJobShort[],
  isJobsLoading: boolean,
  activeJobId: string | null,
  activeJob: IJob | null,
  isActiveJobLoading: boolean,
  isAddingNewJobLoading: boolean,
  isCancellingActiveJob: boolean,
}

const initialState: IInitialState = {
  jobs: [],
  isJobsLoading: false,
  activeJobId: null,
  activeJob: null,
  isAddingNewJobLoading: false,
  isActiveJobLoading: false,
  isCancellingActiveJob: false,
};

export const fetchJobs =
    createAsyncThunk("jobs/fetchJobs", async () => {
        const response = await createHttpRequest<IJobShort[]>({
            method: "GET",
            path: "/jobs"
        });

        return response.data;
    });

export const fetchJobDetails =
    createAsyncThunk("jobs/fetchJobDetails", async (jobId: string) => {
        const response = await createHttpRequest<IJob>({
            method: "GET",
            path: `/jobs/${jobId}`
        });

        return response.data;
    });

export const addJob =
    createAsyncThunk("jobs/addJob", async (data: IAddJobRequest) => {
      const response = await createHttpRequest<{ jobId: string }>({
        method: "POST",
        path: "/jobs",
        data: data,
      });

      return response.data;
    });

export const cancelJob =
    createAsyncThunk("jobs/cancelJob", async (jobId: string) => {
        const response = await createHttpRequest<IJob>({
            method: "DELETE",
            path: `/jobs/${jobId}`
        });

        return response.data;
    });

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setActiveJobId(state, { payload }) {
      state.activeJobId = payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchJobs.pending, (state) => {
      state.isJobsLoading = true;
    });
    builder.addCase(fetchJobs.fulfilled, (state, {payload}) => {
      state.jobs = payload;
      state.isJobsLoading = false;
    });
    builder.addCase(fetchJobs.rejected, (state) => {
      state.isJobsLoading = false;
    });

    builder.addCase(addJob.pending, (state) => {
      state.isAddingNewJobLoading = true;
    });
    builder.addCase(addJob.fulfilled, (state, { payload }) => {
      state.activeJobId = payload.jobId;
      state.isAddingNewJobLoading = false;
    });
    builder.addCase(addJob.rejected, (state) => {
      state.isAddingNewJobLoading = false;
    });

    builder.addCase(fetchJobDetails.pending, (state, action) => {
      if (action.meta.arg !== state.activeJobId) return;
      state.isActiveJobLoading = true;
    });
    builder.addCase(fetchJobDetails.fulfilled, (state, { payload, meta }) => {
      if (meta.arg !== state.activeJobId) return;
      state.activeJob = payload;
      state.isActiveJobLoading = false;
    });
    builder.addCase(fetchJobDetails.rejected, (state, action) => {
      if (action.meta.arg !== state.activeJobId) return;
      state.isActiveJobLoading = false;
    });

    builder.addCase(cancelJob.pending, (state, action) => {
      if (action.meta.arg !== state.activeJobId) return;
      state.isCancellingActiveJob = true;
    });
    builder.addCase(cancelJob.fulfilled, (state, { meta }) => {
      if (meta.arg !== state.activeJobId) return;
      state.isCancellingActiveJob = false;
    });
    builder.addCase(cancelJob.rejected, (state, action) => {
      if (action.meta.arg !== state.activeJobId) return;
      state.isCancellingActiveJob = false;
    });
  },
});

export default jobsSlice.reducer;

export const {
  setActiveJobId,
} = jobsSlice.actions;

const slice = ({ JobsReducer }: RootState) => JobsReducer;

export const jobsSelector = createSelector(slice, ({ jobs }) => jobs);

export const isJobsLoadingSelector = createSelector(slice, ({ isJobsLoading }) => isJobsLoading);

export const activeJobIdSelector = createSelector(
  slice,
  ({ activeJobId }) => activeJobId
);

export const activeJobSelector = createSelector(
  slice,
  ({ activeJob }) => activeJob
);

export const isActiveJobLoadingSelector = createSelector(
  slice,
  ({ isActiveJobLoading }) => isActiveJobLoading,
);

export const isAddingNewJobLoadingSelector = createSelector(
  slice,
  ({ isAddingNewJobLoading }) => isAddingNewJobLoading,
);

export const isCancellingActiveJobSelector = createSelector(
  slice,
  ({ isCancellingActiveJob }) => isCancellingActiveJob,
);
