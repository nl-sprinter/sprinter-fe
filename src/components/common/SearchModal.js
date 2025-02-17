import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

const SearchModal = ({ open, onClose, anchorEl }) => {
    const recentSearches = [
        "추천검색어 예시 1",
        "추천검색어 예시 2",
        "추천검색어 예시 3"
    ];

    const searchRect = anchorEl?.getBoundingClientRect();
    
    const customStyles = {
        overlay: {
            backgroundColor: 'transparent',
            zIndex: 50
        },
        content: {
            position: 'absolute',
            top: searchRect ? `${searchRect.bottom}px` : '64px',
            left: searchRect ? `${searchRect.left}px` : 'auto',
            right: 'auto',
            bottom: 'auto',
            width: searchRect?.width || '400px',
            padding: '0',
            border: '0px solid',
            borderTop: 'none',
            borderRadius: '0 0 0.375rem 0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
    };

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Search Modal"
        >
            <ul className="list-none">
                {recentSearches.map((search, index) => (
                    <li key={index} className="p-3 cursor-pointer hover:bg-gray-100">
                        <span>{search}</span>
                    </li>
                ))}
            </ul>
        </Modal>
    );
};

export default SearchModal;