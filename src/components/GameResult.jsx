/**
 * GameResult 컴포넌트
 *
 * 게임 종료 결과를 표시하는 모달
 * - 성공/실패 메시지
 * - 시도 횟수 및 정답 공개
 * - 재시작/처음으로 버튼
 *
 * @param {Object} props
 * @param {boolean} props.isWon - 게임 승리 여부
 * @param {number} props.attempts - 총 시도 횟수
 * @param {string} props.answer - 정답
 * @param {Function} props.onRestart - 같은 설정으로 재시작
 * @param {Function} props.onGoToSettings - 설정 화면으로 이동
 */
function GameResult({ isWon, attempts, answer, onRestart, onGoToSettings }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in transition-colors duration-300">
        {/* 승리/패배 아이콘 */}
        <div className="text-center mb-6">
          {isWon ? (
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
          ) : (
            <div className="text-6xl mb-4">😢</div>
          )}
          
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isWon ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {isWon ? '정답입니다!' : '게임 종료'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {isWon 
              ? `${attempts}번 만에 맞추셨습니다!`
              : '다시 도전해보세요!'
            }
          </p>
        </div>

        {/* 정답 표시 */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 mb-6 transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2 transition-colors duration-300">정답</p>
          <p className="text-4xl font-mono font-bold text-indigo-600 dark:text-indigo-400 text-center tracking-wider transition-colors duration-300">
            {answer}
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center transition-colors duration-300">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">시도 횟수</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">{attempts}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center transition-colors duration-300">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">자릿수</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">{answer.length}</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg font-semibold
                       hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-95 transition-all duration-300
                       shadow-md hover:shadow-lg"
            aria-label="다시 시작하기"
          >
            다시 시작 🔄
          </button>
          
          <button
            onClick={onGoToSettings}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold
                       hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition-all duration-300"
            aria-label="새 게임 시작하기"
          >
            새 게임 🎮
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameResult
