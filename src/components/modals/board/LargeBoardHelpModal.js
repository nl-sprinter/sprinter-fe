import React from 'react';
import LargeBoardModal from "./LargeBoardModal";

const LargeBoardHelpModal = ({ isOpen, onClose }) => {
    const helpSections = [
        {
            title: "aaaa",
            content: "aaaaaa"
        },
        {
            title: "bbbb",
            content: "bbbbbb"
        }
    ];

    return (
        <LargeBoardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Sprinter 사용 가이드"
            customHeaderClass="border-gray-200"
        >
            <div className="max-w-4xl mx-auto">
                <div className="grid gap-8">
                    {helpSections.map((section, index) => (
                        <div 
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                {section.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        도움이 더 필요하신가요?
                    </h4>
                    <p className="text-gray-600">
                        추가적인 도움이 필요하시다면 kraftenty@gmail.com 으로 문의주세요.
                    </p>
                </div>
            </div>
        </LargeBoardModal>
    );
};

export default LargeBoardHelpModal;