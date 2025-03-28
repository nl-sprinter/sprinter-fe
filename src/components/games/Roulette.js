import { useState, useEffect, useRef } from 'react';
import { FiUsers, FiRefreshCw, FiPlay } from 'react-icons/fi';

const RouletteGame = ({ users }) => {
    const [participants, setParticipants] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [colors, setColors] = useState([]);
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const containerRef = useRef(null);

    // 파스텔톤 색상 생성 (초록색과 파란색 계열 위주)
    const getRandomColor = () => {
        const hues = [
            120, 130, 140, 150, 160, 170, 180, 
            100, 110, 190, 200
        ];
        const hue = hues[Math.floor(Math.random() * hues.length)];
        return `hsl(${hue}, 60%, 75%)`;
    };

    // 참가자 추가/제거 토글
    const toggleParticipant = (user) => {
        const existingIndex = participants.findIndex(p => p.userId === user.userId);
        
        if (existingIndex > -1) {
            const newParticipants = participants.filter(p => p.userId !== user.userId);
            const newColors = colors.filter((_, i) => i !== existingIndex);
            setParticipants(newParticipants);
            setColors(newColors);
            setWinner(null);
        } else if (participants.length < 8) {
            const newParticipants = [...participants, user];
            const newColors = [...colors, getRandomColor()];
            setParticipants(newParticipants);
            setColors(newColors);
            setWinner(null);
        }
    };
    
    // 룰렛 그리기
    const drawRoulette = (currentRotation) => {
        if (!canvasRef.current || participants.length < 2) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // 캔버스 크기 조정 (고해상도 지원)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // 캔버스 초기화
        ctx.clearRect(0, 0, width, height);
        
        // 룰렛 배경
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f5f5f5';
        ctx.fill();
        
        // 12시 방향으로 시작점 조정 (-Math.PI/2 라디안 = -90도)
        const startOffset = -Math.PI / 2;
        const sliceAngle = (2 * Math.PI) / participants.length;
        
        // 각 파이 조각 그리기
        for (let i = 0; i < participants.length; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            const startAngle = i * sliceAngle + currentRotation + startOffset;
            const endAngle = (i + 1) * sliceAngle + currentRotation + startOffset;
            
            ctx.arc(
                centerX, 
                centerY, 
                radius, 
                startAngle, 
                endAngle
            );
            ctx.closePath();
            
            ctx.fillStyle = colors[i];
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // 텍스트 그리기
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#2a3a4a';
            
            // 각 구역의 이름 표시
            const textDistance = radius * 0.7;
            ctx.fillText(participants[i].nickname, textDistance, 0);
            ctx.restore();
        }
        
        // 중앙 원
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff'; 
        ctx.fill();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 12시 방향 화살표 (아래를 향하는)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius + 15); // 화살표 끝 (아래)
        ctx.lineTo(centerX - 8, centerY - radius - 5); // 왼쪽 끝
        ctx.lineTo(centerX + 8, centerY - radius - 5); // 오른쪽 끝
        ctx.closePath();
        
        ctx.fillStyle = '#2e7d32';
        ctx.fill();

        // 디버깅용 표시 (12시 방향에 작은 점으로 표시)
        ctx.beginPath();
        ctx.arc(centerX, centerY - radius, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    };
    
    // 룰렛 회전 애니메이션
    const spinRoulette = () => {
        if (isSpinning || participants.length < 2) return;
        
        // 완전히 초기화
        resetRoulette();
        setIsSpinning(true);
        
        // 초기 회전 속도와 감속 설정
        const spinAmount = (3 + Math.random() * 2) * Math.PI * 2; // 3-5회전
        const duration = 4000 + Math.random() * 2000; // 4-6초
        
        const startTime = performance.now();
        const startRotation = 0; // 시작 회전을 0으로 설정
        const targetRotation = spinAmount;
        
        // 애니메이션 함수
        const animateRoulette = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutCubic 애니메이션 - 부드러운 감속
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
            
            setRotation(currentRotation);
            drawRoulette(currentRotation);
            
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animateRoulette);
            } else {
                // 애니메이션 완료 후 직접 계산으로 승자 결정
                // 참가자가 있는지 한번 더 확인
                if (participants.length >= 2) {
                    determineWinner(currentRotation);
                } else {
                    setIsSpinning(false);
                    console.error("Not enough participants");
                }
            }
        };
        
        // 애니메이션 시작
        animationRef.current = requestAnimationFrame(animateRoulette);
    };
    
    // 별도의 함수로 승자 결정 로직 분리
    const determineWinner = (finalRotation) => {
        if (participants.length < 2) return;

        const sliceAngle = (2 * Math.PI) / participants.length;

        // 회전 각도를 0~2π 범위로 정규화
        let normalizedRotation = finalRotation % (2 * Math.PI);
        if (normalizedRotation < 0) {
            normalizedRotation += 2 * Math.PI;
        }

        // 시계 방향으로 회전하므로, 실제 화살표가 가리키는 위치는 
        // 현재 회전 각도의 반대 방향이 됨
        let adjustedRotation = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);

        // 당첨자 인덱스 계산 (0도가 12시 방향)
        let winningIndex = Math.floor(adjustedRotation / sliceAngle);

        // 디버깅용 로그
        console.log({
            finalRotation: (finalRotation * 180 / Math.PI).toFixed(2) + '°',
            normalizedRotation: (normalizedRotation * 180 / Math.PI).toFixed(2) + '°',
            adjustedRotation: (adjustedRotation * 180 / Math.PI).toFixed(2) + '°',
            sliceAngle: (sliceAngle * 180 / Math.PI).toFixed(2) + '°',
            winningIndex,
            participantsLength: participants.length,
            winnerName: participants[winningIndex]?.nickname
        });

        setWinner(participants[winningIndex]);
        setIsSpinning(false);

        if (containerRef.current) {
            containerRef.current.classList.add('blink-animation');
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.classList.remove('blink-animation');
                }
            }, 800);
        }
    };
    
    // 리셋
    const resetRoulette = () => {
        setWinner(null);
        setRotation(0); // 회전 각도 초기화
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        // 캔버스 다시 그리기
        drawRoulette(0);
    };
    
    // 룰렛 초기 그리기
    useEffect(() => {
        if (participants.length > 1) {
            drawRoulette(rotation);
        }
    }, [participants, colors]);
    
    // 컴포넌트 언마운트 시 애니메이션 정리
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="h-full flex flex-col">
            {/* 참가자 선택 영역 */}
            <div className="flex flex-wrap gap-1 mb-2">
                {users.slice(0, 12).map(user => (
                    <button
                        key={user.userId}
                        onClick={() => toggleParticipant(user)}
                        className={`px-2 py-1 rounded-full text-xs transition-all ${
                            participants.find(p => p.userId === user.userId)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        {user.nickname}
                    </button>
                ))}
            </div>

            {/* 게임 영역 */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg  p-2 relative">
                {participants.length > 1 ? (
                    <>
                        {/* 룰렛 캔버스 */}
                        <canvas
                            ref={canvasRef}
                            style={{ width: '240px', height: '240px' }}
                            className="relative z-10 mb-2"
                        />
                        
                        {/* 결과 표시 */}
                        {winner && (
                            <div className="absolute top-2 left-2 bg-white p-3 rounded-lg border border-green-200 z-20">
                                <div className="text-sm font-medium text-gray-700 mb-1">🎉 당첨자</div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mr-2">
                                        {winner.nickname.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-green-700">{winner.nickname}</span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center p-4 rounded-xl">
                            <FiUsers className="mx-auto mb-2 text-green-400" size={32} />
                            <p className="text-sm">참가자를 선택해주세요 (2~8명)</p>
                            <p className="text-xs text-gray-400 mt-1">참가할 팀원을 위에서 선택하세요!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 컨트롤 버튼 영역 */}
            <div className="flex justify-center gap-2 mt-3">
                {participants.length > 1 && (
                    <>
                    {!isSpinning && !winner && (
                        <button
                            onClick={spinRoulette}
                            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <FiPlay size={16} />
                            룰렛 돌리기
                        </button>
                    )}
                    {isSpinning && (
                        <button
                            disabled
                            className="flex items-center gap-1 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed animate-pulse"
                        >
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            돌아가는 중...
                        </button>
                    )}
                    {winner && (
                        <button
                            onClick={resetRoulette}
                            className="flex items-center gap-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <FiRefreshCw size={16} />
                            다시하기
                        </button>
                    )}
                    </>
                )}
            </div>
            
            {/* CSS 애니메이션 */}
            <style jsx>{`
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                
                .blink-animation {
                    animation: blink 0.2s ease-in-out 3;
                }
            `}</style>
        </div>
    );
};

export default RouletteGame;