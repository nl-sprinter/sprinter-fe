import { Box, Typography, Modal, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const TodoBox = styled(Box)({
    position: 'absolute',
    right: 0,
    top: 0,
    width: '300px',
    height: '100%',
    backgroundColor: 'white',
    borderLeft: '1px solid #e0e0e0',
    padding: '20px'
});

const TodoItem = styled(ListItem)({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #f5f5f5',
    '&:last-child': {
        borderBottom: 'none'
    }
});

const ProjectIndicator = styled(Box)({
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginLeft: '12px'
});

const TodoModal = ({ open, onClose }) => {
    const todos = [
        { project: 'proj1', task: 'Sprint3 - Do Task 1', status: '(0-6)', color: '#4CAF50' },
        { project: 'proj1', task: 'Sprint3 - Do Task 2', status: '(0-6)', color: '#4CAF50' },
        { project: 'proj1', task: 'Calendar - 팀 회식', status: '(0-3)', color: '#4CAF50' },
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            <TodoBox>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Todo List
                </Typography>
                <List>
                    {todos.map((todo, index) => (
                        <TodoItem key={index}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" color="#666666">
                                    {todo.project}
                                </Typography>
                                <Typography>
                                    {todo.task} {todo.status}
                                </Typography>
                            </Box>
                            <ProjectIndicator sx={{ bgcolor: todo.color }}>
                                P
                            </ProjectIndicator>
                        </TodoItem>
                    ))}
                </List>
            </TodoBox>
        </Modal>
    );
};

export default TodoModal;
