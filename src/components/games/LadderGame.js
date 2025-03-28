import { useState, useEffect } from 'react';
import { FiUsers, FiShuffle, FiRefreshCw } from 'react-icons/fi';

const LadderGame = ({ users }) => {
    const [participants, setParticipants] = useState([]);
    const [results, setResults] = useState([]);
    const [ladderPaths, setLadderPaths] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [items, setItems] = useState([]);
    const [activePathIndex, setActivePathIndex] = useState(null);
    const [animation, setAnimation] = useState(false);

    // 결과 항목 설정 (기본값 + 랜덤 요소)
    useEffect(() => {
        const defaultItems = ['당첨', '꽝', '한번 더', '행운의 사람', '오늘의 MVP', '1등', '커피 쏘기', '간식 쏘기'];
        setItems(defaultItems);
    }, []);

    const addParticipant = (user) => {
        if (participants.length < 6 && !participants.find(p => p.userId === user.userId)) {
            setParticipants([...participants, user]);
        }
    };

    const removeParticipant = (userId) => {
        setParticipants(participants.filter(p => p.userId !== userId));
        resetGame();
    };

    const generateLadder = () => {
        if (participants.length < 2) return;

        // 결과 섞기
        const shuffledItems = [...items].sort(() => Math.random() - 0.5).slice(0, participants.length);
        setResults(shuffledItems);

        // 복잡한 사다리 경로 생성
        const paths = [];
        const numHorizontalLines = Math.max(5, participants.length * 2);
        
        for (let i = 0; i < participants.length; i++) {
            // 각 참가자마다 최종 도착점 계산
            let currentPos = i;
            const path = [{ x: currentPos, y: 0 }];
            
            for (let y = 1; y <= numHorizontalLines; y++) {
                // 좌/우 연결 확률을 랜덤하게 결정
                const goLeft = currentPos > 0 && Math.random() < 0.4;
                const goRight = currentPos < participants.length - 1 && Math.random() < 0.4;
                
                if (goLeft) {
                    path.push({ x: currentPos, y: y });
                    currentPos--;
                    path.push({ x: currentPos, y: y });
                } else if (goRight) {
                    path.push({ x: currentPos, y: y });
                    currentPos++;
                    path.push({ x: currentPos, y: y });
                } else {
                    path.push({ x: currentPos, y: y });
                }
            }
            
            // 마지막 위치 추가
            path.push({ x: currentPos, y: numHorizontalLines + 1 });
            paths.push({ path, resultIndex: currentPos });
        }
        
        setLadderPaths(paths);
        setShowResult(true);
    };

    const resetGame = () => {
        setResults([]);
        setLadderPaths([]);
        setShowResult(false);
        setActivePathIndex(null);
        setAnimation(false);
    };

    const runAnimation = (index) => {
        if (animation) return;
        setActivePathIndex(index);
        setAnimation(true);
        
        // 애니메이션 후 결과 표시
        setTimeout(() => {
            setAnimation(false);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col">
            {/* 참가자 선택 영역 */}
            <div className="flex flex-wrap gap-1 mb-2">
                {users.slice(0, 10).map(user => (
                    <button
                        key={user.userId}
                        onClick={() => addParticipant(user)}
                        className={`px-2 py-1 rounded-full text-xs ${
                            participants.find(p => p.userId === user.userId)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        disabled={participants.length >= 6 || participants.find(p => p.userId === user.userId)}
                    >
                        {user.nickname}
                    </button>
                ))}
            </div>

            {/* 게임 영역 */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100 overflow-hidden">
                {participants.length > 0 ? (
                    <>
                        {/* 시작점 */}
                        <div className="flex justify-between px-2 py-2 bg-blue-100">
                            {participants.map((participant, index) => (
                                <div key={participant.userId} className="flex flex-col items-center" style={{ width: `${100 / participants.length}%` }}>
                                    <div 
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-all
                                        ${activePathIndex === index ? 'bg-yellow-500 scale-110' : 'bg-blue-500 hover:bg-blue-600'}`}
                                        onClick={() => runAnimation(index)}
                                    >
                                        {participant.nickname.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={() => removeParticipant(participant.userId)}
                                        className="text-[10px] text-red-500 hover:text-red-700 mt-1"
                                    >
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* 사다리 표시 영역 */}
                        <div className="flex-1 relative">
                            {/* 세로선 */}
                            {participants.map((_, i) => (
                                <div
                                    key={`vline-${i}`}
                                    className="absolute top-0 bottom-0 w-[2px] bg-blue-200"
                                    style={{ left: `calc(${(i / (participants.length - 1)) * 100}% - 1px)` }}
                                />
                            ))}

                            {/* 사다리 경로 */}
                            {showResult && ladderPaths.map((ladderPath, pIndex) => (
                                <svg 
                                    key={`path-${pIndex}`} 
                                    className="absolute inset-0 w-full h-full"
                                    viewBox={`0 0 ${participants.length - 1} 1`}
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d={ladderPath.path.map((point, i) => 
                                            `${i === 0 ? 'M' : 'L'} ${point.x / (participants.length - 1)} ${point.y / (ladderPath.path.length - 1)}`
                                        ).join(' ')}
                                        fill="none"
                                        stroke={activePathIndex === pIndex ? '#FFB800' : '#93C5FD'}
                                        strokeWidth="0.05"
                                        strokeDasharray={activePathIndex === pIndex && animation ? "0.1 0.1" : "none"}
                                        strokeDashoffset={activePathIndex === pIndex && animation ? "0.2" : "0"}
                                        className={activePathIndex === pIndex && animation ? "animate-dash" : ""}
                                    />
                                </svg>
                            ))}
                        </div>

                        {/* 결과 표시 */}
                        <div className="flex justify-between px-2 py-2 bg-blue-100">
                            {participants.map((_, index) => (
                                <div key={index} className="flex flex-col items-center" style={{ width: `${100 / participants.length}%` }}>
                                    {showResult && (
                                        <div className={`px-2 py-1 rounded bg-white text-xs font-medium ${
                                            activePathIndex !== null && ladderPaths[activePathIndex]?.resultIndex === index
                                                ? 'text-yellow-600 ring-2 ring-yellow-400' 
                                                : 'text-gray-700'
                                        }`}>
                                            {results[index] || '?'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <FiUsers className="mx-auto mb-2 text-blue-400" size={24} />
                            <p className="text-sm">참가자를 선택해주세요 (2~6명)</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 컨트롤 버튼 영역 */}
            <div className="flex justify-center gap-2 mt-2">
                {participants.length > 0 && (
                    !showResult ? (
                        <button
                            onClick={generateLadder}
                            disabled={participants.length < 2}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                        >
                            <FiShuffle size={14} />
                            사다리 생성
                        </button>
                    ) : (
                        <button
                            onClick={resetGame}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                            <FiRefreshCw size={14} />
                            다시하기
                        </button>
                    )
                )}
            </div>
            
            {/* CSS 애니메이션 */}
            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .animate-dash {
                    animation: dash 1.5s linear forwards;
                }
            `}</style>
        </div>
    );
};

export default LadderGame;