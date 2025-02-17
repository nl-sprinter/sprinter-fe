import Layout from '../common/Layout';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    
    return (
        <Layout>
            <div className="fixed inset-0 bg-gradient-to-b from-white via-white to-[#3F5F8F] overflow-hidden">
                <div className="relative w-full h-full">
                    <div className="absolute left-[15%] top-1/2 -translate-y-1/2">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-[200px] h-[200px]"
                        />
                    </div>
                    
                    <div className="absolute left-[15%] bottom-[15%]">
                        <h1 className="text-4xl md:text-5xl text-white font-bold drop-shadow-lg">
                            지금 여기서<br/>당신의 프로젝트를 시작하세요!
                        </h1>
                    </div>

                    <div className="absolute right-[15%] bottom-[15%] flex gap-4">
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            로그인
                        </button>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="px-6 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LandingPage;