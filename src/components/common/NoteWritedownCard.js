import React from 'react';
import { FiSave } from 'react-icons/fi';

/**
 * 회의노트 작성 카드 컴포넌트
 * @param {string} value - 노트 내용
 * @param {function} onChange - 노트 내용 변경 시 호출할 함수
 * @param {function} onSave - 저장 버튼 클릭 시 호출할 함수
 * @param {string} title - 카드 제목 (기본값: "회의노트")
 * @param {string} placeholder - 텍스트 영역 플레이스홀더
 */
const NoteWritedownCard = ({
    value = '',
    onChange,
    onSave,
    title = "회의노트",
    placeholder = "마크다운을 사용하여 회의 내용을 작성하세요..."
}) => {
    return (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{title}</h3>
                <button 
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    onClick={onSave}
                    title={`${title} 저장`}
                >
                    <FiSave size={18}/>
                </button>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden flex-grow flex flex-col">
                <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <span className="font-bold">B</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <span className="italic">I</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <span className="underline">U</span>
                    </button>
                    <div className="h-4 w-px bg-gray-300 mx-1"></div>
                    <button className="p-1 hover:bg-gray-200 rounded text-sm">H1</button>
                    <button className="p-1 hover:bg-gray-200 rounded text-sm">H2</button>
                    <button className="p-1 hover:bg-gray-200 rounded text-sm">H3</button>
                </div>
                <textarea
                    className="w-full p-3 flex-grow focus:outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default NoteWritedownCard; 