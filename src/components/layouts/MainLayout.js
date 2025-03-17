import Header from './Header';
import ProjectSidebar from './ProjectSidebar';

const MainLayout = ({children, showSidebar = false, showFunctions = false, showSearchBar = true}) => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Header
                showSidebar={showSidebar}
                showFunctions={showFunctions}
                showSearchBar={showSearchBar}
            />
            <div className="flex flex-1 mt-16 overflow-hidden relative">
                {showSidebar && <ProjectSidebar/>}
                <main 
                    className={`
                        flex-1 
                        ${showSidebar ? 'w-[calc(100%-240px)] ml-60' : 'w-full'} 
                        p-6 
                        overflow-auto 
                        absolute 
                        inset-0
                    `}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
