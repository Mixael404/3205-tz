import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { IJob } from "../../model/job";
import type { RootState } from "../store";
import createHttpRequest from "../../api/axios";

interface IInitialState {
  jobs: IJob[];
  isJobsLoading: boolean;
  activeJobId: string | null;
}

const initialState: IInitialState = {
  jobs: [],
  isJobsLoading: false,
  activeJobId: null,
};

export const fetchJobs =
    createAsyncThunk("jobs/fetchJobs", async () => {
        const response = await createHttpRequest<IJob[]>({
            method: "GET",
            path: "/jobs"
        });

        return response.data;
    })

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
  },
});

export default jobsSlice.reducer;

export const {
  setActiveJobId,
} = jobsSlice.actions;

const slice = ({ JobsReducer }: RootState) => JobsReducer;

export const jobsSelector = createSelector(slice, ({ jobs }) => jobs);

export const isJobsLoadingSelector = createSelector(slice, ({ isJobsLoading }) => isJobsLoading);

export const activeJobSelector = createSelector(
  slice,
  ({ jobs, activeJobId }) => jobs.find((job) => job.id === activeJobId)
);
