import React from 'react';

/**
 * 설정 페이지의 각 섹션을 표시하는 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 섹션의 제목
 * @param {string} [props.description] - 섹션의 설명 (선택사항)
 * @param {React.ReactNode} props.children - 섹션의 내용
 */
const SettingsPanel = ({ title, description, children }) => {
    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-100">
                <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default SettingsPanel;