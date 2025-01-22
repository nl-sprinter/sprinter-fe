import { Box, Typography, Card, Grid } from '@mui/material';
import Layout from '../common/Layout';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const ProjectCard = styled(Card)({
    width: '200px',
    height: '300px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
});

const ProjectIcon = styled(Box)({
    width: 60,
    height: 60,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem'
});

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Layout showFunctions>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                    안녕하세요, ...님!
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item>
                        <ProjectCard sx={{ bgcolor: '#f5f5f5' }} onClick={() => navigate('/startingform')}>
                            <ProjectIcon sx={{ bgcolor: '#e0e0e0' }}>
                                <AddIcon sx={{ fontSize: 32, color: '#666666' }} />
                            </ProjectIcon>
                            <Typography color="#666666" sx={{ alignSelf: 'flex-start' }}>
                                Add Project
                            </Typography>
                        </ProjectCard>
                    </Grid>
                    
                    <Grid item>
                        <ProjectCard sx={{ bgcolor: '#4CAF50' }} onClick={() => navigate('/overview')}>
                            <ProjectIcon sx={{ bgcolor: '#fff' }}>
                                <Typography variant="h3" color="#4CAF50">P</Typography>
                            </ProjectIcon>
                            <Typography color="#fff" sx={{ alignSelf: 'flex-start' }}>
                                proj1
                            </Typography>
                        </ProjectCard>
                    </Grid>
                    
                    <Grid item>
                        <ProjectCard sx={{ bgcolor: '#2196F3' }}>
                            <ProjectIcon sx={{ bgcolor: '#fff' }}>
                                <Typography variant="h3" color="#2196F3">P</Typography>
                            </ProjectIcon>
                            <Typography color="#fff" sx={{ alignSelf: 'flex-start' }}>
                                proj2
                            </Typography>
                        </ProjectCard>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default HomePage;
