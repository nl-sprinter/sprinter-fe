import Layout from '../common/Layout';
import { useNavigate } from 'react-router-dom';
import { sendStartingForm } from '../../api/startingFormApi';

const StartingFormPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            const response = await sendStartingForm(data);
            navigate('/backlogconfirm', { state: { backlogData: response } });
        } catch (error) {
        }
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
                            프로젝트 목표
                        </label>
                        <textarea
                            name="projectGoal"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="프로젝트 목표를 설명해주세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프로젝트 예상 진행 기간
                        </label>
                        <input
                            type="text"
                            name="estimatedDuration"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="예상 진행 기간을 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            스프린트 주기
                        </label>
                        <input
                            type="text"
                            name="sprintCycle"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="스프린트 주기를 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            팀원 몇 명인지
                        </label>
                        <input
                            type="text"
                            name="teamMembers"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="팀원 수를 입력하세요"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            프로젝트에서의 핵심 요구사항
                        </label>
                        <textarea
                            name="essentialFeatures"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            placeholder="핵심 요구사항을 설명해주세요"
                        />
                    </div>
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
            </form>
        </Layout>
    );
};

export default StartingFormPage;