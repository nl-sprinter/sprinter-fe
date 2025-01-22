import {AppBar, Toolbar, Typography, IconButton, InputBase, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import TodoModal from './TodoModal';
import ChatModal from './ChatModal';
import SearchModal from './SearchModal';



const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '24px',
    backgroundColor: '#f5f5f5',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666666'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 5, 1, 2),
    },
}));

const Header = ({ showSidebar = false, showFunctions = false }) => {
    const navigate = useNavigate();
    const [todoModalOpen, setTodoModalOpen] = useState(false);
    const [chatModalOpen, setChatModalOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const searchRef = useRef(null);
    
    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <AppBar 
            position="fixed" 
            elevation={0}
            sx={{
                width: showSidebar ? { xs: '100%', sm: `calc(100% - ${240}px)` } : '100%',
                ml: showSidebar ? { xs: 0, sm: `${240}px` } : 0,
                zIndex: (theme) => theme.zIndex.drawer - 1,
                bgcolor: 'white'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
                    {showFunctions && (
                        <>
                            <Search ref={searchRef}>
                                <StyledInputBase 
                                    placeholder="검색" 
                                    onClick={() => setSearchModalOpen(true)}
                                />
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                            </Search>
                            <IconButton 
                                sx={{ color: '#666666' }}
                                onClick={() => setTodoModalOpen(true)}
                            >
                                <MenuRoundedIcon />
                            </IconButton>
                            <IconButton 
                                sx={{ color: '#666666' }}
                                onClick={() => setChatModalOpen(true)}
                            >
                                <ChatBubbleRoundedIcon />
                            </IconButton>
                            <IconButton 
                                sx={{ color: '#666666' }}
                                onClick={() => navigate('/account')}
                            >
                                <PersonRoundedIcon />
                            </IconButton>
                        </>
                    )}
                    <Box 
                        component="img"
                        src="/images/label.png"
                        alt="Label"
                        sx={{ 
                            height: 24,
                            cursor: 'pointer'
                        }}
                        onClick={handleLogoClick}
                    />
                </Box>
            </Toolbar>
            <TodoModal 
                open={todoModalOpen} 
                onClose={() => setTodoModalOpen(false)} 
            />
            <ChatModal 
                open={chatModalOpen}
                onClose={() => setChatModalOpen(false)}
            />
            <SearchModal 
                open={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                anchorEl={searchRef.current}
            />
        </AppBar>
    );
};

export default Header;