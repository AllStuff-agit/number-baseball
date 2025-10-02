/**
 * GuessHistory 컴포넌트
 *
 * 이전 추측 기록을 표시
 * - 추측 번호, 입력값, 스트라이크/볼 결과
 * - 반응형 카드 레이아웃
 *
 * @param {Object} props
 * @param {Array} props.attempts - 추측 기록 배열
 */
function GuessHistory({ attempts }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <p className="text-sm">아직 추측 기록이 없습니다</p>
        <p className="text-xs mt-1">숫자를 입력하여 게임을 시작하세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
        추측 기록 ({attempts.length}회)
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {attempts.map((attempt) => {
          const { strike, ball } = attempt.result
          const isNothing = strike === 0 && ball === 0
          
          return (
            <div
              key={attempt.attemptNumber}
              className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 
                         hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                {/* 시도 번호 & 추측 값 */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 
                                   bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full 
                                   text-sm font-bold transition-colors duration-300">
                    {attempt.attemptNumber}
                  </span>
                  <span className="font-mono text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    {attempt.guess}
                  </span>
                </div>

                {/* 결과 표시 */}
                <div className="flex items-center gap-2">
                  {/* 스트라이크 */}
                  {strike > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 
                                    bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full transition-colors duration-300">
                      <span className="text-sm">⚾</span>
                      <span className="text-sm font-semibold">
                        {strike}S
                      </span>
                    </div>
                  )}

                  {/* 볼 */}
                  {ball > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 
                                    bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full transition-colors duration-300">
                      <span className="text-sm">⚾</span>
                      <span className="text-sm font-semibold">
                        {ball}B
                      </span>
                    </div>
                  )}

                  {/* 낫싱 */}
                  {isNothing && (
                    <div className="flex items-center gap-1 px-3 py-1 
                                    bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full transition-colors duration-300">
                      <span className="text-sm">⚾</span>
                      <span className="text-sm font-semibold">
                        OUT
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GuessHistory
