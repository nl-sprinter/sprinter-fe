import Modal from 'react-modal';
import { IoMdClose } from "react-icons/io";
import WeightIndicator from '../common/WeightIndicator';

const ProductBacklogModal = ({ isOpen, onClose, backlog }) => {
    if (!backlog) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            portalClassName="modal-portal"
            shouldFocusAfterRender={true}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            preventScroll={true}
            shouldReturnFocusAfterClose={true}
        >
            <div className="flex justify-between items-start mb-8">
                <h2 className="text-xl font-bold">백로그 상세</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <IoMdClose size={24} />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">{backlog.backlogName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Sprint {backlog.sprintOrder}</span>
                        <span>{backlog.sprintName}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">상태</p>
                            <span className={`px-2 py-1 rounded text-sm ${
                                backlog.isFinished
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {backlog.isFinished ? '완료' : '진행중'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">중요도</p>
                            <WeightIndicator weight={backlog.weight} showLabel={false} size="large" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        닫기
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => {
                            // TODO: 백로그 수정 기능 구현
                            onClose();
                        }}
                    >
                        수정
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductBacklogModal;