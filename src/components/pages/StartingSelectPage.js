import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

const StartingSelectPage = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-64px)]">
                <h1 className="text-2xl font-bold text-center mb-12">
                    프로젝트 생성 방식 선택
                </h1>
                <div className="flex justify-center gap-8 flex-1">
                    <button
                        onClick={() => navigate('/startingform')}
                        className="w-80 h-80 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-blue-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col items-center justify-between h-full">
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <BsRobot className="text-6xl text-white" />
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-semibold text-white">
                                    AI와 함께 생성
                                </span>
                                <p className="mt-4 text-sm text-white/80">
                                    Sprinter AI가<br />프로젝트 설정을 도와드립니다
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/simplestartingform')}
                        className="w-80 h-80 bg-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center">
                                <FiPlus className="text-6xl text-gray-600" />
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-2xl font-semibold text-gray-700">
                                빈 프로젝트 생성
                            </span>
                            <p className="mt-4 text-sm text-gray-500">
                                기본 설정으로<br />빠르게 시작하기
                            </p>
                        </div>
                    </button>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        뒤로 가기
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default StartingSelectPage;
