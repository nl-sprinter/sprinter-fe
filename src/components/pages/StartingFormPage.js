import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { sendStartingForm } from '../../api/startingFormApi';
import { BsRobot } from 'react-icons/bs';

const StartingFormPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // 체크된 포지션이 있는지 확인
        const checkedPositions = Array.from(event.target.querySelectorAll('input[name="teamPositions"]:checked'));
        if (checkedPositions.length === 0) {
            alert('최소 하나 이상의 팀원 포지션을 선택해주세요.');
            return;
        }

        // 체크된 도메인이 있는지 확인
        const checkedDomains = Array.from(event.target.querySelectorAll('input[name="projectDomain"]:checked'));
        if (checkedDomains.length === 0) {
            alert('최소 하나 이상의 프로젝트 도메인을 선택해주세요.');
            return;
        }

        try {
            const formData = new FormData(event.target);
            const positions = checkedPositions.map(input => input.value);
            const domains = checkedDomains.map(input => input.value);
            const data = {
                ...Object.fromEntries(formData.entries()),
                teamPositions: positions,
                projectDomain: domains
            };
            const response = await sendStartingForm(data);
            navigate('/backlogconfirm', { state: { backlogData: response } });
        } catch (error) {
        }
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-4">
                        <BsRobot className="text-5xl text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3 text-gray-800">
                        AI와 함께 새 프로젝트 만들기
                    </h1>
                    <p className="text-gray-600 text-lg">
                        프로젝트에 대해 알려주시면 AI가 최적화된 백로그를 생성해드립니다
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            프로젝트 이름
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            required
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="프로젝트 이름을 입력하세요"
                        />
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            프로젝트 목표
                        </label>
                        <textarea
                            name="projectGoal"
                            rows={4}
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="프로젝트 목표를 설명해주세요"
                        />
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            프로젝트 도메인
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'Web/Mobile Services',
                                'Enterprise Systems',
                                'Data & Analytics',
                                'Education',
                                'Healthcare',
                                'Finance',
                                'IoT',
                                'Security',
                                'AI/Chatbot',
                                'Government',
                                'Other'
                            ].map((domain) => (
                                <div key={domain} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={domain}
                                        name="projectDomain"
                                        value={domain}
                                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-purple-300 rounded"
                                    />
                                    <label htmlFor={domain} className="ml-2 text-sm text-gray-700">
                                        {domain}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">최소 하나 이상의 도메인을 선택해주세요</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            팀원 수
                        </label>
                        <input
                            type="text"
                            name="teamMembers"
                            required
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="팀원 수를 입력하세요"
                        />
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            가용한 팀원의 포지션
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'Frontend Developer',
                                'Backend Developer',
                                'Full Stack Developer',
                                'UI/UX Designer',
                                'Product Manager',
                                'Project Manager',
                                'QA Engineer',
                                'DevOps Engineer',
                                'Technical Lead',
                                'Business Analyst',
                                'Other'
                            ].map((position) => (
                                <div key={position} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`position-${position}`}
                                        name="teamPositions"
                                        value={position}
                                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-purple-300 rounded"
                                    />
                                    <label htmlFor={`position-${position}`} className="ml-2 text-sm text-gray-700">
                                        {position}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">최소 하나 이상의 포지션을 선택해주세요</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            프로젝트 예상 진행 기간
                        </label>
                        <input
                            type="text"
                            name="estimatedDuration"
                            required
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="예상 진행 기간을 입력하세요"
                        />
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            스프린트 주기
                        </label>
                        <input
                            type="text"
                            name="sprintCycle"
                            required
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="스프린트 주기를 입력하세요"
                        />
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            AI의 백로그 생성 수준
                        </label>
                        <div className="space-x-4 flex items-center">
                            {['자세히', '보통', '간단하게'].map((level) => (
                                <div key={level} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`detail-${level}`}
                                        name="backlogDetailLevel"
                                        value={level}
                                        required
                                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-purple-300"
                                    />
                                    <label htmlFor={`detail-${level}`} className="ml-2 text-sm text-gray-700">
                                        {level}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            선호하는 기술 스택
                        </label>
                        <input
                            type="text"
                            name="preferredTechStack"
                            required
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="선호하는 기술 스택을 입력하세요 (예: React, Spring, PostgreSQL)"
                        />
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            프로젝트에서의 핵심 요구사항
                        </label>
                        <textarea
                            name="essentialFeatures"
                            rows={4}
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="핵심 요구사항을 설명해주세요"
                        />
                    </div>
                </div>
                
                <div className="flex justify-between pt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 border border-purple-500 text-purple-500 rounded hover:bg-purple-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                        다음
                    </button>
                </div>
            </form>
        </MainLayout>
    );
};

export default StartingFormPage;