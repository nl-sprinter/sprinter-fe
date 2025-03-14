import { useState, useEffect } from 'react';
import SmallFormModal from './SmallFormModal';

const SmallFormSprintCreateEditModal = ({ isOpen, onClose, onSubmit, sprint, actionText }) => {
    const [sprintName, setSprintName] = useState('');

    useEffect(() => {
        if (isOpen && sprint) {
            setSprintName(sprint.sprintName);
        } else if (isOpen) {
            setSprintName('');
        }
    }, [isOpen, sprint]);

    const handleSubmit = () => {
        onSubmit({ sprintName });
    };

    return (
        <SmallFormModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Sprint ${actionText}`}
            submitText="저장"
            onSubmit={handleSubmit}
            isSubmitDisabled={!sprintName.trim()}
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sprint 이름
                </label>
                <input
                    type="text"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Sprint 이름을 입력하세요"
                />
            </div>
        </SmallFormModal>
    );
};

export default SmallFormSprintCreateEditModal;