import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-full text-center py-8">
                <h1 className="text-6xl mb-4 text-gray-600">
                    404
                </h1>
                <h2 className="text-2xl mb-8 text-gray-600">
                    페이지를 찾을 수 없습니다
                </h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    홈으로 돌아가기
                </button>
            </div>
        </MainLayout>
    );
};

export default NotFoundPage;
