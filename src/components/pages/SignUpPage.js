import { Box, Button, TextField, Typography } from '@mui/material';
import Layout from '../common/Layout';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signup } from '../../api/authApi';

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

const SignUpContainer = styled(Box)({
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

const SignUpBox = styled(Box)({
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

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
        password: '',
        passwordConfirm: ''
    });
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        }

        if (!formData.nickname) {
            newErrors.nickname = '닉네임을 입력해주세요';
        }

        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        }

        if (!formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요';
        } else if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            const response = await signup(
                formData.email,
                formData.password,
                formData.nickname
            );
            alert('회원가입이 완료되었습니다!');  // 성공 메시지
            navigate('/');  // LandingPage로 이동
        } catch (error) {
            setErrors({ submit: error.message || '회원가입에 실패했습니다' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Layout>
            <SignUpContainer>
                <SignUpBox component="form" onSubmit={handleSubmit}>
                    <Typography variant="h4" component="h1" textAlign="center" mb={3}>
                        회원가입
                    </Typography>
                    
                    <StyledTextField
                        label="이메일"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                        fullWidth
                        type="email"
                    />
                    
                    <StyledTextField
                        label="닉네임"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        error={!!errors.nickname}
                        helperText={errors.nickname}
                        variant="outlined"
                        fullWidth
                    />
                    
                    <StyledTextField
                        label="비밀번호"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        variant="outlined"
                        fullWidth
                        type="password"
                    />
                    
                    <StyledTextField
                        label="비밀번호 확인"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        error={!!errors.passwordConfirm}
                        helperText={errors.passwordConfirm}
                        variant="outlined"
                        fullWidth
                        type="password"
                    />
                    
                    {errors.submit && (
                        <ValidationMessage>
                            {errors.submit}
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
                        회원가입
                    </Button>

                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{ color: '#666666' }}
                    >
                        뒤로 가기
                    </Button>
                </SignUpBox>
            </SignUpContainer>
        </Layout>
    );
};

export default SignUpPage;