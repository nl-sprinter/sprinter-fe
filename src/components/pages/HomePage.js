import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { FiPlus } from 'react-icons/fi';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Layout showFunctions>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">
                    안녕하세요, ...님!
                </h1>
                
                <div className="flex flex-wrap gap-4">
                    <div 
                        className="w-64 h-64 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => navigate('/startingform')}
                    >
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
                            <FiPlus className="text-4xl text-gray-600" />
                        </div>
                        <span className="text-gray-600">Add Project</span>
                    </div>
                    
                    <div 
                        className="w-64 h-64 bg-green-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
                        onClick={() => navigate('/overview')}
                    >
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4">
                            <span className="text-4xl text-green-500">P</span>
                        </div>
                        <span className="text-white">proj1</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
