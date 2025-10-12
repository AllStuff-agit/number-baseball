import { useState } from 'react'

/**
 * GameSettings 컴포넌트
 *
 * 게임 시작 전 설정을 담당
 * - 자릿수 선택 (3~9자리)
 * - 첫자리 0 허용 옵션
 * - 게임 규칙 설명
 * - 게임 시작 버튼
 * - 기록 보기 버튼
 *
 * @param {Object} props
 * @param {Function} props.onStartGame - 게임 시작 콜백 ({digits, allowLeadingZero} 전달)
 * @param {Function} props.onShowRecords - 기록 보기 콜백
 */
function GameSettings({ onStartGame, onShowRecords }) {
  const [digits, setDigits] = useState(3)
  const [allowLeadingZero, setAllowLeadingZero] = useState(false)

  const handleStart = () => {
    onStartGame({ digits, allowLeadingZero })
  }

  return (
    <div className="space-y-5">
      {/* 게임 규칙 설명 */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/30 transition-colors duration-300 shadow-sm">
        <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3 transition-colors duration-300 tracking-tight">게임 규칙</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <li className="flex items-start gap-2 p-2 bg-white/60 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm">
            <span className="text-green-600 dark:text-green-400 text-base transition-colors duration-300">⚾</span>
            <span className="font-medium text-sm"><strong className="text-green-600 dark:text-green-400">Strike:</strong> 숫자와 위치가 모두 일치</span>
          </li>
          <li className="flex items-start gap-2 p-2 bg-white/60 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm">
            <span className="text-orange-500 dark:text-orange-400 text-base transition-colors duration-300">⚾</span>
            <span className="font-medium text-sm"><strong className="text-orange-600 dark:text-orange-400">Ball:</strong> 숫자는 있지만 위치가 다름</span>
          </li>
          <li className="flex items-start gap-2 p-2 bg-white/60 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm">
            <span className="text-gray-400 dark:text-gray-500 text-base transition-colors duration-300">⚾</span>
            <span className="font-medium text-sm"><strong className="text-gray-600 dark:text-gray-400">Out:</strong> 일치하는 숫자 없음</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium bg-white/40 dark:bg-gray-800/30 rounded-xl p-2 backdrop-blur-sm">
          💡 중복되지 않는 숫자를 맞춰야 합니다!
        </p>
      </div>

      {/* 자릿수 선택 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300 tracking-tight">
          자릿수 선택
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setDigits(num)}
              className={`
                py-3 px-4 rounded-xl font-bold transition-all duration-300 text-base
                ${digits === num
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/50 scale-105 border-2 border-indigo-400 dark:border-indigo-300'
                  : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md backdrop-blur-sm'
                }
              `}
              aria-label={`${num}자리 선택`}
              aria-pressed={digits === num}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">
          선택된 자릿수: <strong className="text-indigo-600 dark:text-indigo-400 transition-colors duration-300">{digits}자리</strong>
        </p>
      </div>

      {/* 첫자리 0 허용 옵션 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 transition-colors duration-300 backdrop-blur-sm">
        <div>
          <label
            htmlFor="allowLeadingZero"
            className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300 tracking-tight"
          >
            첫자리 0 허용
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 font-medium">
            활성화 시 012, 023 같은 숫자도 가능합니다
          </p>
        </div>
        <button
          id="allowLeadingZero"
          role="switch"
          aria-checked={allowLeadingZero}
          onClick={() => setAllowLeadingZero(!allowLeadingZero)}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
            shadow-inner
            ${allowLeadingZero ? 'bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        >
          <span
            className={`
              inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md
              ${allowLeadingZero ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* 버튼 그룹 */}
      <div className="space-y-3">
        {/* 게임 시작 버튼 */}
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white py-3.5 rounded-2xl font-bold text-base
                     hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-600 dark:hover:to-blue-600
                     active:scale-[0.98] transition-all duration-300
                     shadow-xl shadow-indigo-300/50 dark:shadow-indigo-900/50 hover:shadow-2xl hover:shadow-indigo-400/60 dark:hover:shadow-indigo-800/60
                     border border-indigo-400/30 dark:border-indigo-300/30 tracking-wide"
          aria-label="게임 시작하기"
        >
          게임 시작
        </button>

        {/* 기록 보기 버튼 */}
        <button
          onClick={onShowRecords}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 text-white py-3.5 rounded-2xl font-bold text-base
                     hover:from-amber-700 hover:to-orange-700 dark:hover:from-amber-600 dark:hover:to-orange-600
                     active:scale-[0.98] transition-all duration-300
                     shadow-xl shadow-amber-300/50 dark:shadow-amber-900/50 hover:shadow-2xl hover:shadow-amber-400/60 dark:hover:shadow-amber-800/60
                     border border-amber-400/30 dark:border-amber-300/30 tracking-wide"
          aria-label="기록 보기"
        >
          🏆 기록 보기
        </button>
      </div>
    </div>
  )
}

export default GameSettings
