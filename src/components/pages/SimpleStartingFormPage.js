import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const SimpleStartingFormPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // TODO: API 연결
        navigate('/home');
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <FiPlus className="text-4xl text-gray-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 text-gray-800">
                        새 프로젝트 만들기
                    </h1>
                    <p className="text-gray-600 text-lg">
                        기본 설정으로 빠르게 시작하세요
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프로젝트 이름
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            placeholder="프로젝트 이름을 입력하세요"
                        />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            스프린트 주기
                        </label>
                        <input
                            type="text"
                            name="sprintCycle"
                            required
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            placeholder="스프린트 주기를 입력하세요"
                        />
                    </div>
                </div>
                
                <div className="flex justify-between pt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        생성하기
                    </button>
                </div>
            </form>
        </MainLayout>
    );
};

export default SimpleStartingFormPage;