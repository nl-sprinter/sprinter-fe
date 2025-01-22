import {Box} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({children, showSidebar = false, showFunctions = false}) => {
    return (
        <Box sx={{ 
            height: '100vh',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Header showSidebar={showSidebar} showFunctions={showFunctions}/>
            <Box sx={{ 
                display: 'flex', 
                flex: 1, 
                mt: '64px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {showSidebar && <Sidebar/>}
                <Box 
                    component="main"
                    sx={{
                        flex: 1,
                        width: showSidebar ? `calc(100% - 240px)` : '100%',
                        ml: showSidebar ? '240px' : 0,
                        p: 3,
                        overflow: 'auto',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
