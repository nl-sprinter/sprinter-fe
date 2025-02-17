import { NavLink } from 'react-router-dom';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import { useState } from 'react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const projects = [
        { name: 'proj1', color: '#4CAF50' },
        { name: 'proj2', color: '#2196F3' },
        { name: 'proj3', color: '#FF9800' }
    ];

    const menuItems = [
        { text: 'Overview', path: '/overview' },
        { text: 'Product Backlog', path: '/productbacklog' },
        { text: 'Sprint', path: '/sprint' },
        { text: 'Calendar', path: '/calendar' }
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-60 bg-gray-100 border-r border-gray-200">
            <div className="flex items-center p-4 w-full">
                <div className="w-8 h-8 bg-green-500 rounded-lg mr-3"></div>
                <div className="flex-grow">Proj1</div>
                <button 
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiArrowUp /> : <FiArrowDown />}
                </button>
            </div>
            
            <div className={`transition-all duration-200 ${isOpen ? 'h-auto mb-2' : 'h-0'} overflow-hidden`}>
                <div className="mx-4 bg-white rounded-lg overflow-hidden shadow-sm">
                    {projects.map((project) => (
                        <div 
                            key={project.name} 
                            className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                        >
                            <div 
                                className="w-6 h-6 rounded mr-2"
                                style={{ backgroundColor: project.color }}
                            ></div>
                            <span>{project.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <nav className="px-2">
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            block px-3 py-2 my-1
                            rounded-lg
                            transition-colors
                            ${isActive 
                                ? 'bg-gray-200 text-gray-900' 
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}
                        `}
                    >
                        {item.text}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
