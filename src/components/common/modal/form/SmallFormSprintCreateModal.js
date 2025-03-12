import { useState, useEffect } from 'react';
import SmallFormModal from './SmallFormModal';

const SmallFormSprintCreateModal = ({ isOpen, onClose, onSubmit }) => {
    const [sprintName, setSprintName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSprintName('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        onSubmit({ sprintName });
    };

    return (
        <SmallFormModal
            isOpen={isOpen}
            onClose={onClose}
            title="새 스프린트 생성"
            submitText="생성"
            onSubmit={handleSubmit}
            isSubmitDisabled={!sprintName.trim()}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    스프린트 이름
                </label>
                <input
                    type="text"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="스프린트 이름을 입력하세요"
                />
            </div>
        </SmallFormModal>
    );
};

export default SmallFormSprintCreateModal;