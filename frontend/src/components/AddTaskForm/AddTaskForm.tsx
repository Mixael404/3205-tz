import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import type { TypedDispatch } from "../../store/store";
import { addJob, fetchJobs, isAddingNewJobLoadingSelector } from "../../store/slices/job-slice";
import { validateUrls } from "../../shared/utils/validateUrls";

interface IAddNewJobForm {
    urls: string,
}

const AddTaskForm: FC = () => {
  const dispatch = useDispatch<TypedDispatch>();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<IAddNewJobForm>({ mode: "onChange" });
  const isAddingNewJobLoading = useSelector(isAddingNewJobLoadingSelector);

  const onSubmit = async (data: IAddNewJobForm) => {
    const urls: string[] = data.urls.split("\n");
    try {
      await dispatch(addJob({ urls }));
    } finally {
      dispatch(fetchJobs());
      reset();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 shrink-0">
        Add new checking task
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 min-h-0 flex flex-col"
      >
        <label
          htmlFor="urls"
          className="text-sm font-medium text-slate-600 mb-2 shrink-0"
        >
          URLs to check
        </label>
        <textarea
          {...register("urls", { validate: validateUrls })}
          id="urls"
          placeholder={"https://example.com\nhttps://another-example.com"}
          className="flex-1 min-h-0 resize-none border border-slate-200 rounded-md p-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
        {errors.urls && (
          <span className="text-xs text-red-600 mt-1 shrink-0">
            {errors.urls.message}
          </span>
        )}

        <button
          type="submit"
          className="mt-4 shrink-0 self-start px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          {isAddingNewJobLoading ? "Starting..." : "Start new job"}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;
