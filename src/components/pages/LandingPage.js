import { Box, Button, Typography } from '@mui/material';
import Layout from '../common/Layout';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const LandingContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    background: 'linear-gradient(180deg, #FFFFFF 10%, #3F5F8F 100%)',
    overflow: 'hidden'
});

const ContentWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    height: '100%'
});

const LogoContainer = styled(Box)({
    position: 'absolute',
    left: '15%',
    top: '50%',
    transform: 'translateY(-50%)'
});

const TextContainer = styled(Box)({
    position: 'absolute',
    left: '15%',
    bottom: '15%'
});

const ButtonGroup = styled(Box)({
    position: 'absolute',
    right: '15%',
    bottom: '15%',
    display: 'flex',
    gap: '1rem'
});

const LandingPage = () => {
    const navigate = useNavigate();
    
    return (
        <Layout>
            <LandingContainer>
                <ContentWrapper>
                    <LogoContainer>
                        <Box
                            component="img"
                            src="/images/logo.png"
                            alt="Logo"
                            sx={{
                                width: 200,
                                height: 200
                            }}
                        />
                    </LogoContainer>
                    
                    <TextContainer>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            color="white" 
                            sx={{ 
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            지금 여기서<br/>당신의 프로젝트를 시작하세요!
                        </Typography>
                    </TextContainer>

                    <ButtonGroup>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                bgcolor: '#4CAF50',
                                '&:hover': {
                                    bgcolor: '#45a049'
                                }
                            }}
                            onClick={() => navigate('/login')}
                        >
                            로그인
                        </Button>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                bgcolor: '#f5f5f5',
                                color: '#666666',
                                '&:hover': {
                                    bgcolor: '#e0e0e0'
                                }
                            }}
                            onClick={() => navigate('/signup')}
                        >
                            회원가입
                        </Button>
                    </ButtonGroup>
                </ContentWrapper>
            </LandingContainer>
        </Layout>
    );
};

export default LandingPage;