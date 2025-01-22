import { Box, Typography, Paper, List, ListItem, Divider } from '@mui/material';
import Layout from '../common/Layout';
import { styled } from '@mui/material/styles';

const BacklogContainer = styled(Paper)({
    margin: '24px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    overflow: 'hidden'
});

const BacklogList = styled(List)({
    padding: '20px',
    '&::-webkit-scrollbar': {
        width: '8px'
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
        '&:hover': {
            background: '#666'
        }
    }
});

const BacklogItem = styled(ListItem)({
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    marginBottom: '12px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease'
    }
});

const ProductBacklogPage = () => {
    const backlogs = [
        { sprint: 'sprint1', title: 'aaaa' },
        { sprint: 'sprint1', title: 'bbbb' },
        { sprint: 'sprint2', title: 'bcbcb' },
        // ... 더 많은 백로그 아이템들
    ];

    return (
        <Layout showFunctions showSidebar>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    Product Backlog
                </Typography>
                
                <BacklogContainer>
                    <BacklogList>
                        {backlogs.map((backlog, index) => (
                            <Box key={index}>
                                <BacklogItem>
                                    <Typography variant="h6">
                                        {backlog.sprint} - {backlog.title}
                                    </Typography>
                                </BacklogItem>
                                
                            </Box>
                        ))}
                    </BacklogList>
                </BacklogContainer>
            </Box>
        </Layout>
    );
};

export default ProductBacklogPage;