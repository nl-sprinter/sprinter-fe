import Layout from '../common/Layout';
import { useNavigate } from 'react-router-dom';

const BacklogConfirmPage = () => {
    const navigate = useNavigate();

    // 제출버튼 눌렀을 때
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(JSON.stringify(data)); // 서버로 전송하는 로직 추가
        navigate('/home');
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="px-[10%] py-8 overflow-y-auto">
                <h1 className="text-2xl font-bold text-center mb-8">
                    AI 추천 백로그
                </h1>
                <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4 mb-8">
                    {/* 백로그 항목 리스트 */}
                    <p className="mb-4">백로그 항목 1</p>
                    <p className="mb-4">백로그 항목 2</p>
                    <p className="mb-4">백로그 항목 3</p>
                    {/* 더 많은 백로그 항목들 */}
                </div>
                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        className="w-[120px] px-4 py-2 border border-green-500 text-green-500 rounded hover:border-green-600 hover:text-green-600"
                        onClick={() => navigate('/home')}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="w-[120px] px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        만들기
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default BacklogConfirmPage;