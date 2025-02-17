import Layout from '../common/Layout';
import { useNavigate } from 'react-router-dom';

const StartingFormPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(JSON.stringify(data));
        navigate('/backlogconfirm');
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-center mb-8">
                    새 프로젝트 만들기
                </h1>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프로젝트 이름
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="프로젝트 이름을 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프로젝트 설명
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="프로젝트에 대해 설명해주세요"
                        />
                    </div>
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="px-6 py-2 border border-green-500 text-green-500 rounded hover:border-green-600 hover:text-green-600"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            다음
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    );
};

export default StartingFormPage;