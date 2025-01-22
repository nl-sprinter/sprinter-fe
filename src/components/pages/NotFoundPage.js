import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100%',          // 상단바로 인한 스크롤바 제거
                    textAlign: 'center',        // 상단바로 인한 스크롤바 제거
                    py: 4                       // 상단바로 인한 스크롤바 제거
                }}
            >
                <Typography variant="h1" sx={{ mb: 2, color: '#666666' }}>
                    404
                </Typography>
                <Typography variant="h4" sx={{ mb: 4, color: '#666666' }}>
                    페이지를 찾을 수 없습니다
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                        bgcolor: '#4CAF50',
                        '&:hover': { bgcolor: '#45a049' }
                    }}
                >
                    홈으로 돌아가기
                </Button>
            </Box>
        </Layout>
    );
};

export default NotFoundPage;
