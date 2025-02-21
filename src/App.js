import AppRoutes from './routes/Routes';
import { LoadingProvider } from './contexts/LoadingContext';
import { ErrorProvider } from './contexts/ErrorContext';

function App() {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <AppRoutes/>
      </LoadingProvider>
    </ErrorProvider>
  );
}

export default App;
