import { Box, Button, TextField, Typography } from '@mui/material';
import Layout from '../common/Layout';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const AccountContainer = styled(Box)({
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: '#666666',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4CAF50',
            borderWidth: 1,
        },
    },
    '& .MuiInputLabel-root': {
        color: '#666666',
        '&.Mui-focused': {
            color: '#4CAF50',
        },
    },
    '& .MuiInputBase-input': {
        color: '#333333',
    },
    '&.Mui-disabled .MuiInputBase-input': {
        color: '#666666',
        '-webkit-text-fill-color': '#666666',
    }
});

const ButtonGroup = styled(Box)({
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem'
});

const ValidationMessage = styled(Typography)({
    color: '#ff0000',
    fontSize: '0.75rem',
    marginTop: '4px'
});

const AccountPage = () => {
    const navigate = useNavigate();
    
    return (
        <Layout>
            <AccountContainer>
                <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                    계정 정보 수정
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography sx={{ mb: 1 }}>이메일</Typography>
                        <StyledTextField
                            fullWidth
                            disabled
                            value="kraftenty@gmail.com"
                        />
                    </Box>
                    
                    <Box>
                        <Typography sx={{ mb: 1 }}>닉네임</Typography>
                        <StyledTextField
                            fullWidth
                            disabled
                            value="enty"
                        />
                    </Box>
                    
                    <Box>
                        <Typography sx={{ mb: 1 }}>현재 비밀번호</Typography>
                        <StyledTextField
                            fullWidth
                            type="password"
                        />
                        <ValidationMessage>Validation Message</ValidationMessage>
                    </Box>
                    
                    <Box>
                        <Typography sx={{ mb: 1 }}>새 비밀번호</Typography>
                        <StyledTextField
                            fullWidth
                            type="password"
                        />
                        <ValidationMessage>Validation Message</ValidationMessage>
                    </Box>
                    
                    <Box>
                        <Typography sx={{ mb: 1 }}>새 비밀번호 확인</Typography>
                        <StyledTextField
                            fullWidth
                            type="password"
                        />
                        <ValidationMessage>Validation Message</ValidationMessage>
                    </Box>
                </Box>
                
                <ButtonGroup>
                    <Button 
                        variant="contained" 
                        sx={{ 
                            bgcolor: '#e0e0e0',
                            color: '#666666',
                            '&:hover': { bgcolor: '#d0d0d0' }
                        }}
                        onClick={() => navigate(-1)}
                    >
                        뒤로가기
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{
                            bgcolor: '#009688',
                            color: 'white',
                            '&:hover': { bgcolor: '#00897b' }
                        }}
                    >
                        수정
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{
                            bgcolor: '#AA0000',
                            color: 'white',
                            '&:hover': { bgcolor: '#990000' }
                        }}
                    >
                        회원 탈퇴
                    </Button>
                </ButtonGroup>
            </AccountContainer>
        </Layout>
    );
};

export default AccountPage;