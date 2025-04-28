import React from 'react';
import LargeBoardModal from "./LargeBoardModal";
import { FiAward, FiCalendar, FiCheckSquare, FiClock, FiList, FiMessageSquare, FiPlus, FiTarget, FiUsers, FiZap } from 'react-icons/fi';

const LargeBoardHelpModal = ({ isOpen, onClose }) => {
    const helpSections = [
        {
            title: "Sprinter 소개",
            icon: <FiTarget className="text-blue-500" size={24} />,
            content: "Sprinter는 팀원 간의 온라인 협업을 돕기 위해 만들어진 플랫폼으로, 애자일 프로그래밍의 Scrum 방법론을 채택하고 있습니다. 팀과 함께 프로젝트를 점진적으로 완성해 나가며, 효율적인 협업 경험을 제공합니다."
        },
        {
            title: "AI 기반 프로젝트 생성",
            icon: <FiZap className="text-yellow-500" size={24} />,
            content: "AI를 활용하여 프로젝트의 기초를 자동으로 구성할 수 있습니다. 프로젝트의 목표와 규모에 맞는 백로그를 AI가 추천해주며, 생성된 내용은 언제든지 자유롭게 수정이 가능합니다. 빠르게 프로젝트를 시작하고 싶다면 AI의 도움을 받아보세요."
        },
        {
            title: "Overview 페이지",
            icon: <FiUsers className="text-green-500" size={24} />,
            content: "프로젝트의 전반적인 정보를 한눈에 확인할 수 있는 페이지입니다. 팀원 목록을 확인하고 관리할 수 있으며, 팀원들과 함께 즐길 수 있는 미니게임도 제공됩니다. 프로젝트의 시작점이자 팀원들과의 소통 공간입니다."
        },
        {
            title: "Backlog 관리",
            icon: <FiList className="text-purple-500" size={24} />,
            content: "백로그는 프로젝트의 핵심 작업 단위입니다. 각 백로그에 상/중/하의 중요도를 부여할 수 있으며, 진행 상태를 '진행중'에서 '완료'로 변경할 수 있습니다. 백로그를 클릭하면 상세 정보를 확인하고 관리할 수 있습니다."
        },
        {
            title: "Task와 Issue 관리",
            icon: <FiCheckSquare className="text-indigo-500" size={24} />,
            content: "각 백로그 내에서 Task와 Issue를 생성하고 관리할 수 있습니다. Task에는 담당자를 지정할 수 있으며, 완료된 Task는 백로그의 진행도에 반영됩니다. Issue를 통해 문제점이나 논의사항을 기록하고 추적할 수 있습니다."
        },
        {
            title: "Daily Scrum",
            icon: <FiClock className="text-orange-500" size={24} />,
            content: "매일의 진행 상황을 공유하는 Daily Scrum을 생성하고 관리할 수 있습니다. Sprint 페이지에서 오늘의 Daily Scrum을 쉽게 확인할 수 있으며, 팀원들과 함께 진행 상황과 이슈를 공유할 수 있습니다."
        },
        {
            title: "프로젝트 진행 현황",
            icon: <FiAward className="text-red-500" size={24} />,
            content: "개인별 기여도 시스템을 통해 각 팀원의 활동을 추적하고 평가할 수 있습니다. Burn-Down Chart와 Velocity 그래프를 통해 프로젝트의 진행 상황을 시각적으로 확인할 수 있으며, 이를 통해 프로젝트의 건강도를 파악할 수 있습니다."
        },
        {
            title: "Calendar",
            icon: <FiCalendar className="text-teal-500" size={24} />,
            content: "프로젝트의 모든 일정을 캘린더를 통해 관리할 수 있습니다. 팀원들과 일정을 공유하고, 중요한 마일스톤이나 회의 일정을 등록할 수 있습니다. 모든 팀원이 동일한 캘린더를 공유하여 일정 조율이 용이합니다."
        },
        {
            title: "커뮤니케이션 도구",
            icon: <FiMessageSquare className="text-cyan-500" size={24} />,
            content: "프로젝트 상단바에서 Todo, Chat, Notification 기능을 사용할 수 있습니다. 실시간 채팅으로 팀원들과 소통하고, Todo 리스트로 개인 작업을 관리하며, 중요한 알림을 놓치지 않고 확인할 수 있습니다."
        }
    ];

    return (
        <LargeBoardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Sprinter 사용 가이드"
            customHeaderClass="border-gray-200"
        >
            <div className="max-w-4xl mx-auto px-4">
                <div className="grid gap-8">
                    {helpSections.map((section, index) => (
                        <div 
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FiPlus className="text-blue-500" />
                        도움이 더 필요하신가요?
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                        추가적인 도움이 필요하시다면 <a href="mailto:kraftenty@gmail.com" className="text-blue-500 hover:text-blue-600 font-medium">kraftenty@gmail.com</a> 으로 문의해주세요.
                        더 나은 Sprinter를 만들기 위한 여러분의 의견을 기다립니다.
                    </p>
                </div>
            </div>
        </LargeBoardModal>
    );
};

export default LargeBoardHelpModal;