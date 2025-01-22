import {Box, TextField, Typography, Button, LinearProgress} from '@mui/material';
import Layout from '../common/Layout';
import {styled} from '@mui/material/styles';
import {useRef, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const ProgressBar = styled(Box)({
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    zIndex: 1000,
});

const FormSection = styled(Box)({
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 20px',
    scrollSnapAlign: 'start',
});

const FormContainer = styled(Box)({
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    scrollBehavior: 'smooth'
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
});

const NextButton = styled(Button)({
    marginTop: '24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    width: '120px',
    alignSelf: 'flex-end',
    '&:hover': {
        backgroundColor: '#45a049'
    }
});

const PrevButton = styled(Button)({
    marginTop: '24px',
    backgroundColor: '#e0e0e0',
    color: '#666666',
    width: '120px',
    marginRight: '12px',
    '&:hover': {
        backgroundColor: '#d0d0d0'
    }
});

const ButtonContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
});

const StartingFormPage = () => {
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState(0);
    const containerRef = useRef(null);
    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    const handlePrev = () => {
        const container = containerRef.current;
        if (!container || currentSection <= 0) return;

        const prevSection = currentSection - 1;
        container.scrollTo({
            top: prevSection * (window.innerHeight - 64),
            behavior: 'smooth'
        });
    };

    const handleNext = () => {
        const container = containerRef.current;
        if (!container || currentSection >= sections.length - 1) return;

        const nextSection = currentSection + 1;
        container.scrollTo({
            top: nextSection * (window.innerHeight - 64),
            behavior: 'smooth'
        });
    };

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;

        const currentIndex = Math.round(scrollPosition / windowHeight);
        setCurrentSection(currentIndex);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const sections = [
        {
            title: "프로젝트의 이름을 알려주세요",
            subtitle: "멋진 이름으로 시작해볼까요?",
            field: (
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <StyledTextField
                        fullWidth
                        placeholder="프로젝트 이름"
                        variant="outlined"
                        sx={{mt: 4}}
                    />
                    <NextButton onClick={handleNext}>
                        다음으로
                    </NextButton>
                </Box>
            )
        },
        {
            title: "팀 인원수를 선택해주세요",
            subtitle: "함께할 동료는 몇 명인가요?",
            field: (
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <StyledTextField
                        fullWidth
                        type="number"
                        placeholder="팀 인원수"
                        variant="outlined"
                        sx={{mt: 4}}
                    />
                    <ButtonContainer>
                        <PrevButton onClick={handlePrev}>
                            이전으로
                        </PrevButton>
                        <NextButton onClick={handleNext}>
                            다음으로
                        </NextButton>
                    </ButtonContainer>
                </Box>
            )
        },
        {
            title: "프로젝트의 목표는 무엇인가요?",
            subtitle: "이루고자 하는 목표를 설정해주세요",
            field: (
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <StyledTextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="프로젝트 목표"
                        variant="outlined"
                        sx={{mt: 4}}
                    />
                    <ButtonContainer>
                        <PrevButton onClick={handlePrev}>
                            이전으로
                        </PrevButton>
                        <NextButton onClick={handleNext}>
                            다음으로
                        </NextButton>
                    </ButtonContainer>
                </Box>
            )
        },
        {
            title: "사용할 기술 스택을 입력해주세요",
            subtitle: "쉼표로 구분하여 입력해주세요",
            field: (
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <StyledTextField
                        fullWidth
                        placeholder="React, Spring, MySQL..."
                        variant="outlined"
                        sx={{mt: 4}}
                    />
                    <ButtonContainer>
                        <PrevButton onClick={handlePrev}>
                            이전으로
                        </PrevButton>
                        <NextButton onClick={handleNext}>
                            다음으로
                        </NextButton>
                    </ButtonContainer>
                </Box>
            )
        },
        {
            title: "프로젝트 주제를 선택해주세요",
            subtitle: "어떤 분야의 프로젝트인가요?",
            field: (
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <StyledTextField
                        fullWidth
                        placeholder="프로젝트 주제"
                        variant="outlined"
                        sx={{mt: 4}}
                    />
                    <ButtonContainer>
                        <PrevButton onClick={handlePrev}>
                            이전으로
                        </PrevButton>
                        <NextButton onClick={handleNext}>
                            다음으로
                        </NextButton>
                    </ButtonContainer>
                </Box>
            )
        },
        {
            title: "프로젝트 진행 기간을 입력해주세요",
            subtitle: "목표 기간을 설정해주세요",
            field: (
                <Box sx={{mt: 4, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <StyledTextField
                        fullWidth
                        type="date"
                        variant="outlined"
                        label="시작일"
                    />
                    <StyledTextField
                        fullWidth
                        type="date"
                        variant="outlined"
                        label="종료일"
                    />
                    <ButtonContainer>
                        <PrevButton onClick={handlePrev}>
                            이전으로
                        </PrevButton>
                        <Button
                            variant="contained"
                            sx={{
                                width: '120px',
                                bgcolor: '#4CAF50',
                                '&:hover': {bgcolor: '#45a049'}
                            }}
                            onClick={() => navigate('/home')}
                        >
                            완료
                        </Button>
                    </ButtonContainer>
                </Box>
            )
        }
    ];

    const progress = ((currentSection + 1) / sections.length) * 100;

    return (
        <Layout>
            <ProgressBar>
                <Box
                    sx={{
                        height: `${progress}%`,
                        width: '100%',
                        backgroundColor: '#4CAF50',
                        transition: 'height 0.3s ease'
                    }}
                />
            </ProgressBar>
            <FormContainer ref={containerRef}>
                {sections.map((section, index) => (
                    <FormSection key={index} ref={sectionRefs[index]}>
                        <Typography variant="h3" component="h1">
                            {section.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={{mt: 2, color: '#666666'}}>
                            {section.subtitle}
                        </Typography>
                        {section.field}
                    </FormSection>
                ))}
            </FormContainer>
        </Layout>
    );
};

export default StartingFormPage;