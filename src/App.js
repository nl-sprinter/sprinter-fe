import AppRoutes from './routes/Routes';
import { LoadingModal } from './components/common/modal/global/LoadingModal';
import { ErrorModal } from './components/common/modal/global/ErrorModal';
import AxiosSetup from './api/AxiosSetup';
import Modal from 'react-modal';

// 모달이 마운트될 루트 엘리먼트 설정
Modal.setAppElement('#root');

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
