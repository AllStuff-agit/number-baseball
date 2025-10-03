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
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in transition-colors duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-10 animate-scale-in border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        {/* 승리/패배 아이콘 */}
        <div className="text-center mb-8">
          {isWon ? (
            <div className="text-7xl mb-5 animate-bounce">🎉</div>
          ) : (
            <div className="text-7xl mb-5">😢</div>
          )}

          <h2 className={`text-4xl font-black mb-3 transition-colors duration-300 tracking-tight ${
            isWon ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {isWon ? '정답입니다!' : '게임 종료'}
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">
            {isWon
              ? `${attempts}번 만에 맞추셨습니다!`
              : `${attempts}번의 시도 끝에 실패했습니다.`
            }
          </p>
          {!isWon && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
              다시 도전해보세요!
            </p>
          )}
        </div>

        {/* 정답 표시 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl p-8 mb-8 border border-indigo-200/50 dark:border-indigo-800/50 transition-colors duration-300 shadow-inner">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 text-center mb-3 transition-colors duration-300 tracking-wider uppercase">정답</p>
          <p className="text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 text-center tracking-widest transition-colors duration-300">
            {answer}
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl p-5 text-center border border-gray-200/50 dark:border-gray-600/50 transition-colors duration-300 backdrop-blur-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300 tracking-wider uppercase">시도 횟수</p>
            <p className="text-3xl font-black text-gray-800 dark:text-gray-100 transition-colors duration-300">{attempts}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl p-5 text-center border border-gray-200/50 dark:border-gray-600/50 transition-colors duration-300 backdrop-blur-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300 tracking-wider uppercase">자릿수</p>
            <p className="text-3xl font-black text-gray-800 dark:text-gray-100 transition-colors duration-300">{answer.length}</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white py-4 rounded-2xl font-bold text-base
                       hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-600 dark:hover:to-blue-600
                       active:scale-[0.98] transition-all duration-300
                       shadow-xl shadow-indigo-300/50 dark:shadow-indigo-900/50 hover:shadow-2xl hover:shadow-indigo-400/60 dark:hover:shadow-indigo-800/60
                       border border-indigo-400/30 dark:border-indigo-300/30 tracking-wide"
            aria-label="다시 시작하기"
          >
            다시 시작
          </button>

          <button
            onClick={onGoToSettings}
            className="w-full bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-bold text-base
                       hover:bg-white dark:hover:bg-gray-700 active:scale-[0.98] transition-all duration-300
                       border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg backdrop-blur-sm tracking-wide"
            aria-label="새 게임 시작하기"
          >
            🆕 새 게임
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameResult
