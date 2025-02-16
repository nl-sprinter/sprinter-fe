import {Box, TextField, Typography, Button } from '@mui/material';
import Layout from '../common/Layout';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';



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
});


const BacklogConfirmPage = () => {
    const navigate = useNavigate();

    // 제출버튼 눌렀을 때
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(JSON.stringify(data)); // 서버로 전송하는 로직 추가
        navigate('/home');
    };

    return (
        <Layout>
            <Box component="form" onSubmit={handleSubmit} sx={{padding: '32px 10%', overflowY: 'auto'}}>
                <Typography variant="h4" component="h1" sx={{textAlign: 'center', mb: 4}}>
                    AI 추천 백로그
                </Typography>
                <Box sx={{height: '400px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px', p: 2, mb: 4}}>
                    {/* 백로그 항목 리스트 */}
                    <Typography variant="body1" sx={{mb: 2}}>
                        백로그 항목 1
                    </Typography>
                    <Typography variant="body1" sx={{mb: 2}}>
                        백로그 항목 2
                    </Typography>
                    <Typography variant="body1" sx={{mb: 2}}>
                        백로그 항목 3
                    </Typography>
                    {/* 더 많은 백로그 항목들 */}
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 4}}>
                    <Button
                        variant="outlined"
                        sx={{
                            width: '120px',
                            color: '#4CAF50',
                            borderColor: '#4CAF50',
                            '&:hover': {borderColor: '#45a049', color: '#45a049'}
                        }}
                        onClick={() => navigate('/home')}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            width: '120px',
                            bgcolor: '#4CAF50',
                            '&:hover': {bgcolor: '#45a049'}
                        }}
                    >
                        만들기
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};

export default BacklogConfirmPage;