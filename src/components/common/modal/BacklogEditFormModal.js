import { useState, useEffect } from 'react';
import SmallFormModal from './SmallFormModal';
import WeightIndicator from '../WeightIndicator';

const BacklogEditFormModal = ({ isOpen, onClose, onSubmit, backlog }) => {
    const [title, setTitle] = useState('');
    const [selectedWeight, setSelectedWeight] = useState(null);

    useEffect(() => {
        if (isOpen && backlog) {
            setTitle(backlog.title);
            setSelectedWeight(backlog.weight);
        }
    }, [isOpen, backlog]);

    const handleSubmit = () => {
        onSubmit({
            title: title.trim(),
            weight: selectedWeight
        });
    };

    return (
        <SmallFormModal
            isOpen={isOpen}
            onClose={onClose}
            title="백로그 수정"
            submitText="수정"
            onSubmit={handleSubmit}
            isSubmitDisabled={!title.trim() || !selectedWeight}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        내용
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="백로그 내용을 입력하세요"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        가중치
                    </label>
                    <div className="flex items-center justify-between gap-4 mt-2">
                        {[1, 2, 3].map((weight) => (
                            <button
                                key={weight}
                                type="button"
                                onClick={() => setSelectedWeight(weight)}
                                className={`flex-1 py-2 px-4 rounded-lg border ${
                                    selectedWeight === weight 
                                        ? 'border-green-500 bg-green-50 text-green-700' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <WeightIndicator 
                                        weight={weight} 
                                        showLabel={false} 
                                        size="small" 
                                    />
                                    <span className="text-sm">
                                        {weight === 1 ? '1. 낮음' : weight === 2 ? '2. 보통' : '3. 높음'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </SmallFormModal>
    );
};

export default BacklogEditFormModal;