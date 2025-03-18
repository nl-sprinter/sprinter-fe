import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const ProjectDropdown = ({ projects, selectedProject, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedProject?.projectName || '프로젝트 선택'}</span>
                <FiChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && projects.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-1">
                        {projects.map((project) => (
                            <li 
                                key={project.projectId}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                                    selectedProject?.projectId === project.projectId ? 'bg-green-50 text-green-700' : ''
                                }`}
                                onClick={() => {
                                    onSelect(project);
                                    setIsOpen(false);
                                }}
                            >
                                {project.projectName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProjectDropdown; 