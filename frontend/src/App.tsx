import JobsList from "./components/JobsList/JobsList";
import MainLayout from "./components/Layouts/MainLayout/MainLayout";

import "simplebar-react/dist/simplebar.min.css";

function App() {
  return (
    <MainLayout>
      <JobsList />
    </MainLayout>
  );
}

export default App;
