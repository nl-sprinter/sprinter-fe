import { Box, Typography, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';

const ChatBox = styled(Box)({
    position: 'absolute',
    right: 0,
    top: 0,
    width: '300px',
    height: '100%',
    backgroundColor: 'white',
    borderLeft: '1px solid #e0e0e0',
    padding: '20px'
});

const ChatModal = ({ open, onClose }) => {
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
            <ChatBox>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    채팅
                </Typography>
            </ChatBox>
        </Modal>
    );
};

export default ChatModal; 