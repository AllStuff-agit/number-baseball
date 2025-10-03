import { useState } from 'react'

/**
 * GameSettings 컴포넌트
 *
 * 게임 시작 전 설정을 담당
 * - 자릿수 선택 (3~9자리)
 * - 첫자리 0 허용 옵션
 * - 게임 규칙 설명
 * - 게임 시작 버튼
 *
 * @param {Object} props
 * @param {Function} props.onStartGame - 게임 시작 콜백 ({digits, allowLeadingZero} 전달)
 */
function GameSettings({ onStartGame }) {
  const [digits, setDigits] = useState(3)
  const [allowLeadingZero, setAllowLeadingZero] = useState(false)

  const handleStart = () => {
    onStartGame({ digits, allowLeadingZero })
  }

  return (
    <div className="space-y-6">
      {/* 게임 규칙 설명 */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 transition-colors duration-300">
        <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-3 transition-colors duration-300">게임 규칙</h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <li className="flex items-start">
            <span className="text-green-600 dark:text-green-400 mr-2 transition-colors duration-300">⚾</span>
            <span><strong>Strike:</strong> 숫자와 위치가 모두 일치</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 dark:text-orange-400 mr-2 transition-colors duration-300">⚾</span>
            <span><strong>Ball:</strong> 숫자는 있지만 위치가 다름</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 dark:text-gray-500 mr-2 transition-colors duration-300">⚾</span>
            <span><strong>Out:</strong> 일치하는 숫자 없음</span>
          </li>
        </ul>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          💡 중복되지 않는 숫자를 맞춰야 합니다!
        </p>
      </div>

      {/* 자릿수 선택 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
          자릿수 선택
        </label>
        <div className="grid grid-cols-7 gap-2">
          {[3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => setDigits(num)}
              className={`
                py-3 px-4 rounded-lg font-semibold transition-all duration-300
                ${digits === num
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600'
                }
              `}
              aria-label={`${num}자리 선택`}
              aria-pressed={digits === num}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          선택된 자릿수: <strong className="text-indigo-600 dark:text-indigo-400 transition-colors duration-300">{digits}자리</strong>
        </p>
      </div>

      {/* 첫자리 0 허용 옵션 */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300">
        <div>
          <label
            htmlFor="allowLeadingZero"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300"
          >
            첫자리 0 허용
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
            활성화 시 012, 023 같은 숫자도 가능합니다
          </p>
        </div>
        <button
          id="allowLeadingZero"
          role="switch"
          aria-checked={allowLeadingZero}
          onClick={() => setAllowLeadingZero(!allowLeadingZero)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
            ${allowLeadingZero ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
              ${allowLeadingZero ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* 게임 시작 버튼 */}
      <button
        onClick={handleStart}
        className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-4 rounded-lg font-bold text-lg
                   hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-95 transition-all duration-300
                   shadow-lg hover:shadow-xl"
        aria-label="게임 시작하기"
      >
        게임 시작 🎮
      </button>
    </div>
  )
}

export default GameSettings
