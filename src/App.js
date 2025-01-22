import {ThemeProvider} from '@mui/material';
import theme from './styles/theme';
import AppRoutes from './routes/Routes';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppRoutes/>
        </ThemeProvider>
    );
}

export default App;
