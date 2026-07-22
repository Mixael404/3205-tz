import ActiveJob from "../ActiveJob/ActiveJob";
import AddTaskForm from "../AddTaskForm/AddTaskForm";
import JobsList from "../JobsList/JobsList";
import MainLayout from "../Layouts/MainLayout/MainLayout";

import styles from "./App.module.scss";
import "simplebar-react/dist/simplebar.min.css";

function App() {
  return (
    <MainLayout>
      <div className={styles["top-left"]}>
        <JobsList />
      </div>
      <div className={`${styles["top-right"]} p-6`}>
        <AddTaskForm />
      </div>
      <div className={`${styles["bottom"]} py-4 px-6`}>
        <ActiveJob />
      </div>
    </MainLayout>
  );
}

export default App;
