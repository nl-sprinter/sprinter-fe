import { Box, Typography, Modal, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const SearchBox = styled(Box)({
    position: 'absolute',
    top: '64px',
    right: '240px',
    width: '400px',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

const SearchItem = styled(ListItem)({
    padding: '12px 20px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#f5f5f5'
    }
});

const SearchModal = ({ open, onClose, anchorEl }) => {
    const recentSearches = [
        "추천검색어 예시 1",
        "추천검색어 예시 2",
        "추천검색어 예시 3"
    ];

    const searchRect = anchorEl?.getBoundingClientRect();
    const modalTop = searchRect ? searchRect.bottom : 64;
    const modalLeft = searchRect ? searchRect.left : 'auto';

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'transparent'
                }
            }}
        >
            <SearchBox
                sx={{
                    top: modalTop,
                    left: modalLeft,
                    width: searchRect?.width || 400
                }}
            >
                <List>
                    {recentSearches.map((search, index) => (
                        <SearchItem key={index}>
                            <Typography>{search}</Typography>
                        </SearchItem>
                    ))}
                </List>
            </SearchBox>
        </Modal>
    );
};

export default SearchModal;