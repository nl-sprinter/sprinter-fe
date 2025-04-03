import Modal from 'react-modal';
import { IoMdClose } from "react-icons/io";
import WeightIndicator from '../common/WeightIndicator';
import BacklogTaskCompleteIndicator from '../common/BacklogTaskCompleteIndicator';

const ProductBacklogModal = ({ isOpen, onClose, backlog }) => {
    if (!backlog) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            portalClassName="modal-portal"
            shouldFocusAfterRender={true}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            preventScroll={true}
            shouldReturnFocusAfterClose={true}
        >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">{backlog.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Sprint {backlog.sprintOrder}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1"
                >
                    <IoMdClose size={20} />
                </button>
            </div>

            {/* 상태 표시 */}
            <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${
                    backlog.isFinished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {backlog.isFinished ? '완료' : '진행중'}
                </span>
            </div>

            {/* 중요도와 완성도를 한 줄에 배치 */}
            <div className="flex items-center gap-8 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">중요도:</span>
                    <WeightIndicator weight={backlog.weight} showLabel={false} size="large" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">완성도:</span>
                    <BacklogTaskCompleteIndicator completeRate={backlog.completeRate} showLabel={false} size="large" />
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    닫기
                </button>
            </div>
        </Modal>
    );
};

export default ProductBacklogModal;