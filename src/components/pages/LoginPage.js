import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import Layout from '../common/Layout';
import { styled } from '@mui/material/styles';
import { useNavigate} from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import { login } from '../../api/authApi';

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
    }
});

const LoginContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #FFFFFF 10%, #3F5F8F 100%)',
    overflow: 'hidden'
});

const LoginBox = styled(Box)({
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    margin: '0 20px'
});

const ValidationMessage = styled(Typography)({
    color: '#ff0000',
    fontSize: '0.75rem',
    marginTop: '4px'
});

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await login(formData.email, formData.password);
            if (response.status === 200) {
                console.log(`LoginPage:로그인 성공`)
                navigate('/home');
            }
        } catch (error) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <Layout>
            <LoginContainer>
                <LoginBox component="form" onSubmit={handleSubmit}>
                    <Typography variant="h4" component="h1" textAlign="center" mb={3}>
                        로그인
                    </Typography>
                    
                    <StyledTextField
                        label="이메일"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        type="email"
                        required
                    />
                    
                    <StyledTextField
                        label="비밀번호"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        type="password"
                        required
                    />
                    
                    {error && (
                        <ValidationMessage>
                            {error}
                        </ValidationMessage>
                    )}
                    
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: '#4CAF50',
                            '&:hover': { bgcolor: '#45a049' }
                        }}
                    >
                        로그인
                    </Button>
                    
                    <Divider>또는</Divider>
                    
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        sx={{
                            borderColor: '#666666',
                            color: '#666666',
                            '&:hover': {
                                borderColor: '#444444',
                                bgcolor: 'rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        Start with Google
                    </Button>
                    
                    <Button
                        variant="text"
                        onClick={() => navigate('/signup')}
                        sx={{ color: '#666666' }}
                    >
                        계정이 없으신가요? 회원가입
                    </Button>
                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{ color: '#666666' }}
                    >
                        뒤로 가기
                    </Button>
                </LoginBox>
            </LoginContainer>
        </Layout>
    );
};

export default LoginPage;