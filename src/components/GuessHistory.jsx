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
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <div className="text-5xl mb-4">🎯</div>
        <p className="text-base font-semibold mb-2">아직 추측 기록이 없습니다</p>
        <p className="text-sm opacity-75">숫자를 입력하여 게임을 시작하세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300 tracking-wider uppercase flex items-center gap-2">
        <span className="w-1.5 h-4 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></span>
        추측 기록 ({attempts.length}회)
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {attempts.map((attempt) => {
          const { strike, ball } = attempt.result
          const isNothing = strike === 0 && ball === 0

          return (
            <div
              key={attempt.attemptNumber}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800
                         border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3
                         hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg
                         transition-all duration-300 animate-slide-up backdrop-blur-sm"
              style={{ animationDelay: `${attempt.attemptNumber * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                {/* 시도 번호 & 추측 값 */}
                <div className="flex items-center gap-2 min-w-0 flex-shrink">
                  <span className="flex items-center justify-center w-8 h-8 flex-shrink-0
                                   bg-gradient-to-br from-indigo-500 to-blue-500 dark:from-indigo-600 dark:to-blue-600
                                   text-white rounded-xl shadow-md
                                   text-xs font-black transition-colors duration-300">
                    {attempt.attemptNumber}
                  </span>
                  <span className={`font-mono font-black text-gray-800 dark:text-gray-100 transition-colors duration-300 tracking-wider min-w-0 ${
                    attempt.guess.length >= 6 ? 'text-base' : attempt.guess.length >= 5 ? 'text-lg' : 'text-xl'
                  }`}>
                    {attempt.guess}
                  </span>
                </div>

                {/* 결과 표시 */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* 스트라이크 */}
                  {strike > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1
                                    bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40
                                    text-green-700 dark:text-green-400 rounded-lg transition-colors duration-300
                                    border border-green-200 dark:border-green-800 shadow-sm">
                      <span className="text-sm">⚾</span>
                      <span className="text-xs font-black">
                        {strike}S
                      </span>
                    </div>
                  )}

                  {/* 볼 */}
                  {ball > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1
                                    bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40
                                    text-orange-700 dark:text-orange-400 rounded-lg transition-colors duration-300
                                    border border-orange-200 dark:border-orange-800 shadow-sm">
                      <span className="text-sm">⚾</span>
                      <span className="text-xs font-black">
                        {ball}B
                      </span>
                    </div>
                  )}

                  {/* 낫싱 */}
                  {isNothing && (
                    <div className="flex items-center gap-1 px-2 py-1
                                    bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-600 dark:to-slate-600
                                    text-gray-600 dark:text-gray-300 rounded-lg transition-colors duration-300
                                    border border-gray-200 dark:border-gray-500 shadow-sm">
                      <span className="text-sm">⚾</span>
                      <span className="text-xs font-black">
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
