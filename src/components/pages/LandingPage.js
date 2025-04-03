import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureBox = ({ title, description, isVisible }) => {



    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-80 bg-white/60 backdrop-blur-md rounded-xl p-8 shadow-2xl"
                >
                    <h3 className="text-3xl font-bold mb-6 text-gray-800">{title}</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// 새로운 버튼 카드 컴포넌트
const ButtonCard = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full h-80 bg-white/60 backdrop-blur-md rounded-xl p-8 shadow-2xl flex flex-col justify-center gap-4"
        >
            <h3 className="text-3xl font-bold mb-6 text-gray-800"> 지금 시작하세요</h3>
            <button 
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                로그인
            </button>
            <button 
                onClick={() => navigate('/signup')}
                className="w-full py-3 bg-white/80 text-gray-700 rounded-lg hover:bg-white transition-all text-base font-medium border border-gray-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
                회원가입
            </button>
        </motion.div>
    );
};

const LandingPage = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const intervalRef = useRef(null);

    const features = [
        {
            title: "프로젝트 관리의 혁신",
            description: "Sprinter와 함께라면 복잡한 프로젝트도 간단하게. 직관적인 인터페이스로 팀원들과 효율적으로 협업하세요."
        },
        {
            title: "실시간 커뮤니케이션",
            description: "채팅, 알림, 댓글 기능으로 팀원들과 실시간 소통. 언제 어디서나 프로젝트 진행 상황을 공유할 수 있습니다."
        },
        {
            title: "Agile한 작업 관리",
            description: "스프린트를 중심으로 프로젝트의 모든 것을 한눈에 파악하고 관리하세요."
        }
    ];

    // 5초마다 다음 카드로 전환
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // 수동으로 카드 변경
    const changeFeature = (index) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setActiveFeature(index);
        // 수동 변경 후 자동 전환 다시 시작
        intervalRef.current = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);
    };



    return (
        <MainLayout>
            <div className="fixed inset-0 bg-gradient-to-b from-white via-white to-[#3F5F8F] overflow-hidden" style={{ zIndex: 1 }}>
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
                            당신의 프로젝트는<br/>Sprinter 로부터 시작됩니다
                        </h1>
                    </div>
                </div>
            </div>

            {/* 카드 그룹 컨테이너 */}
            <div className="fixed right-12 top-1/2 -translate-y-1/2 w-96 flex flex-col gap-4" style={{ zIndex: 30 }}>
                {features.map((feature, index) => (
                    <div key={index} className={activeFeature === index ? "block" : "hidden"}>
                        <FeatureBox
                            title={feature.title}
                            description={feature.description}
                            isVisible={activeFeature === index}
                        />
                    </div>
                ))}
                <ButtonCard />
            </div>

            {/* 인디케이터 - 첫 번째 카드 옆으로 이동 */}
            <motion.div 
                className="fixed right-4 top-1/2 -translate-y-[8rem] flex flex-col gap-2"
                style={{ zIndex: 40 }}
            >
                {[0, 1, 2].map((index) => (
                    <button
                        key={index}
                        onClick={() => changeFeature(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-150
                            ${activeFeature === index 
                                ? 'bg-green-500 scale-125 shadow-md' 
                                : 'bg-gray-300 hover:bg-green-300'}`}
                    />
                ))}
            </motion.div>
        </MainLayout>
    );
};

export default LandingPage;