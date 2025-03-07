import { NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowDown, FiArrowUp, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useUserProjectStore } from '../../../store/useUserProjectStore';
import { useProjectNavigationStore } from '../../../store/useProjectNavigationStore';

const Sidebar = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    
    const { projects, fetchProjects } = useUserProjectStore();
    const { 
        projectId: currentProjectId, 
        setProjectId,
        sprints,
        isSprintOpen,
        setIsSprintOpen 
    } = useProjectNavigationStore();

    console.log(`isSprintOpen: ${isSprintOpen}`); // TODO

    // 현재 선택된 프로젝트 찾기
    const currentProject = projects.find(p => p.projectId === currentProjectId);

    // 프로젝트 목록 가져오기
    useEffect(() => {
        const fetchProjectsList = async () => {
            if (projects.length === 0) {
                await fetchProjects();
            }
        };

        fetchProjectsList();
    }, [projects.length, fetchProjects]);

    // 최초 마운트 시에만 URL의 projectId로 초기화
    useEffect(() => {
        if (projectId && !currentProjectId) {
            setProjectId(parseInt(projectId));
        }
    }, []); // 최초 마운트 시에만 실행

    // URL이 /sprint로 끝날 때 드롭다운 메뉴 열기
    useEffect(() => {
        if (location.pathname.endsWith('/sprint')) {
            console.log(`[DEBUG] URL이 /sprint로 끝날 때 드롭다운 메뉴 열기, isSprintOpen = ${isSprintOpen}`)
            setIsSprintOpen(true);
        }
    }, [location.pathname]); // isSprintOpen 의존성 제거

    const handleProjectClick = (project) => {
        setProjectId(project.projectId);
        setIsOpen(false);
        navigate(`/project/${project.projectId}`);
    };

    const menuItems = [
        { text: 'Overview', path: 'overview', type: 'link' },
        { text: 'Product Backlog', path: 'productbacklog', type: 'link' },
        { text: 'Sprint', type: 'dropdown' },
        { text: 'Calendar', path: 'calendar', type: 'link' }
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-60 bg-gray-100 border-r border-gray-200">
            <div className="flex items-center p-4 w-full">
                <div 
                    className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center text-white font-medium bg-green-500"
                >
                    {currentProject?.projectName[0]?.toUpperCase()}
                </div>
                <div className="flex-grow truncate">{currentProject?.projectName}</div>
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
                            key={project.projectId}
                            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                                currentProjectId === project.projectId ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => handleProjectClick(project)}
                        >
                            <div 
                                className="w-6 h-6 rounded mr-2 flex items-center justify-center text-white text-sm bg-green-500"
                            >
                                {project.projectName[0]?.toUpperCase()}
                            </div>
                            <span className="truncate">{project.projectName}</span>
                        </div>
                    ))}
                </div>
            </div>

            <nav className="px-2">
                {menuItems.map((item) => (
                    item.type === 'link' ? (
                        <NavLink 
                            key={item.path}
                            to={`/project/${projectId}/${item.path}`}
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
                    ) : (
                        <div key={item.text} className="relative">
                            <div className="flex items-center">
                                <button
                                    onClick={() => {
                                        navigate(`/project/${projectId}/sprint`);
                                    }}
                                    className={`flex-1 flex items-center px-3 py-2 my-1 rounded-lg transition-colors ${
                                        location.pathname.includes('/sprint')
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                                >
                                    Sprint
                                </button>
                                <button
                                    onClick={() => setIsSprintOpen(!isSprintOpen)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        location.pathname.includes('/sprint')
                                            ? 'text-gray-900'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {isSprintOpen ? <FiChevronDown className="ml-2" /> : <FiChevronRight className="ml-2" />}
                                </button>
                            </div>
                            
                            <div className={isSprintOpen ? 'block' : 'hidden'}>
                                {sprints.map((sprint) => (
                                    <NavLink
                                        key={sprint.sprintId}
                                        to={`/project/${projectId}/sprint/${sprint.sprintId}`}
                                        className={({ isActive }) => `
                                            block pl-6 pr-3 py-2
                                            text-sm
                                            transition-colors
                                            ${isActive
                                                ? 'font-bold text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900'}
                                        `}
                                        onClick={(e) => {
                                            e.stopPropagation();  // 이벤트 버블링 방지
                                        }}
                                    >
                                        {sprint.sprintName}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
