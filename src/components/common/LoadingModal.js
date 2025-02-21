import Modal from 'react-modal';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0
    }
};

const LoadingModal = ({ isOpen }) => {
    return (
        <Modal
            isOpen={isOpen}
            style={customStyles}
            contentLabel="Loading Modal"
        >
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                <p className="mt-4 text-white font-medium">처리중입니다...</p>
            </div>
        </Modal>
    );
};

export default LoadingModal; 