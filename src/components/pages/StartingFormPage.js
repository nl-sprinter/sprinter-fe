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


const StartingFormPage = () => {
    const navigate = useNavigate();

    // 제출버튼 눌렀을 때
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(JSON.stringify(data)); // 서버로 전송하는 로직 추가
        navigate('/backlogconfirm');
    };

    return (
        <Layout>
            <Box component="form" onSubmit={handleSubmit} sx={{padding: '32px 10%', overflowY: 'auto'}}>
                <h1>프로젝트 시작하기</h1>
                <br/><br/><br/>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" component="h2">
                        프로젝트의 이름을 알려주세요
                    </Typography>
                    <Typography variant="body1" sx={{mt: 0.5, color: '#666666'}}>
                        멋진 이름으로 시작해볼까요?
                    </Typography>
                    <StyledTextField
                        fullWidth
                        name="projectName"
                        placeholder="프로젝트 이름"
                        variant="outlined"
                        sx={{mt: 1}}
                    />
                </Box>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" component="h2">
                        팀 인원수를 선택해주세요
                    </Typography>
                    <Typography variant="body1" sx={{mt: 0.5, color: '#666666'}}>
                        함께할 동료는 몇 명인가요?
                    </Typography>
                    <StyledTextField
                        fullWidth
                        name="teamSize"
                        type="number"
                        placeholder="팀 인원수"
                        variant="outlined"
                        sx={{mt: 1}}
                    />
                </Box>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" component="h2">
                        프로젝트의 목표는 무엇인가요?
                    </Typography>
                    <Typography variant="body1" sx={{mt: 0.5, color: '#666666'}}>
                        이루고자 하는 목표를 설정해주세요
                    </Typography>
                    <StyledTextField
                        fullWidth
                        name="projectGoal"
                        multiline
                        rows={3}
                        placeholder="프로젝트 목표"
                        variant="outlined"
                        sx={{mt: 1}}
                    />
                </Box>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" component="h2">
                        사용할 기술 스택을 입력해주세요
                    </Typography>
                    <Typography variant="body1" sx={{mt: 0.5, color: '#666666'}}>
                        쉼표로 구분하여 입력해주세요
                    </Typography>
                    <StyledTextField
                        fullWidth
                        name="techStack"
                        placeholder="React, Spring, MySQL..."
                        variant="outlined"
                        sx={{mt: 1}}
                    />
                </Box>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" component="h2">
                        프로젝트 주제를 선택해주세요
                    </Typography>
                    <Typography variant="body1" sx={{mt: 0.5, color: '#666666'}}>
                        어떤 분야의 프로젝트인가요?
                    </Typography>
                    <StyledTextField
                        fullWidth
                        name="projectTopic"
                        placeholder="프로젝트 주제"
                        variant="outlined"
                        sx={{mt: 1}}
                    />
                </Box>
                <Box sx={{mb: 3}}>
                    <Typography variant="h5" component="h2">
                        프로젝트 진행 기간을 입력해주세요
                    </Typography>
                    <Typography variant="body1" sx={{mt: 0.5, color: '#666666'}}>
                        대략 얼마나 진행할건가요?
                    </Typography>
                    <StyledTextField
                        fullWidth
                        name="projectDuration"
                        placeholder="프로젝트 진행 기간"
                        variant="outlined"
                        sx={{mt: 1}}
                    />
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
                        뒤로가기
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
                        제출
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};

export default StartingFormPage;