import AppRoutes from './routes/Routes';
import { LoadingModal } from './components/common/LoadingModal';
import { ErrorModal } from './components/common/ErrorModal';
import AxiosSetup from './api/AxiosSetup';

function App() {
  return (
    <ErrorModal>
      <LoadingModal>
        <AxiosSetup>
          <AppRoutes />
        </AxiosSetup>
      </LoadingModal>
    </ErrorModal>
  );
}

export default App;
