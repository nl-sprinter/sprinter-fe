import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const DiceGame = () => {
    const [isRolling, setIsRolling] = useState(false);
    const [diceNumber, setDiceNumber] = useState(null);

    const rollDice = () => {
        setIsRolling(true);
        setDiceNumber(null);
        
        // 주사위 굴리는 애니메이션 효과를 위한 임시 숫자들
        let rollCount = 0;
        const maxRolls = 10; // 10번 변경
        const rollInterval = setInterval(() => {
            setDiceNumber(Math.floor(Math.random() * 6) + 1);
            rollCount++;
            
            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                setIsRolling(false);
            }
        }, 100);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="mb-8">
                {diceNumber ? (
                    <div className={`w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl font-bold text-green-600 border-2 border-green-100 ${isRolling ? 'animate-bounce' : ''}`}>
                        {diceNumber}
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                        ?
                    </div>
                )}
            </div>
            
            <button
                onClick={rollDice}
                disabled={isRolling}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                    isRolling 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
                <FiRefreshCw size={18} className={isRolling ? 'animate-spin' : ''} />
                주사위 굴리기
            </button>
        </div>
    );
};

export default DiceGame; 