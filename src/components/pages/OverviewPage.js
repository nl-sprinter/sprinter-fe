import {Box, Typography, IconButton, Grid} from '@mui/material';
import Layout from '../common/Layout';
import {styled} from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';

const TitleContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
});

const ContentBox = styled(Box)({
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    height: '400px',
    padding: '20px'
});

const OverviewPage = () => {
    return (
        <Layout showFunctions showSidebar>
            <Box sx={{p: 4}}>
                <TitleContainer>
                    <Typography variant="h4" component="h1">
                        Proj1
                    </Typography>
                    <IconButton
                        sx={{
                            color: '#666666',
                            '&:hover': {bgcolor: '#f5f5f5'}
                        }}
                    >
                        <SettingsIcon/>
                    </IconButton>
                </TitleContainer>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <ContentBox>
                            <Typography variant="h6" sx={{color: '#666666'}}>
                                항목1
                            </Typography>
                        </ContentBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ContentBox>
                            <Typography variant="h6" sx={{color: '#666666'}}>
                                항목2
                            </Typography>
                        </ContentBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ContentBox>
                            <Typography variant="h6" sx={{color: '#666666'}}>
                                항목3
                            </Typography>
                        </ContentBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ContentBox>
                            <Typography variant="h6" sx={{color: '#666666'}}>
                                항목4
                            </Typography>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default OverviewPage;