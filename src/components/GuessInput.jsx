import { useState } from 'react'
import { getMaxAttempts } from '../utils/gameLogic'

/**
 * GuessInput 컴포넌트
 *
 * 사용자 입력을 받는 컴포넌트
 * - 숫자 입력 필드 (중복 불가, 자릿수 제한)
 * - 제출 버튼
 * - 실시간 입력 유효성 검사
 *
 * @param {Object} props
 * @param {number} props.digits - 자릿수
 * @param {boolean} props.allowLeadingZero - 첫자리 0 허용 여부
 * @param {Function} props.onSubmit - 제출 콜백 (guess 전달)
 * @param {boolean} props.disabled - 입력 비활성화 여부
 */
function GuessInput({ digits, allowLeadingZero, onSubmit, disabled }) {
  const maxAttempts = getMaxAttempts({ digits, allowLeadingZero })
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  // 실시간 입력 검증
  const handleInputChange = (e) => {
    const value = e.target.value

    // 숫자만 입력 허용
    if (value && !/^\d*$/.test(value)) {
      setError('숫자만 입력 가능합니다')
      return
    }

    // 자릿수 제한
    if (value.length > digits) {
      return
    }

    setInput(value)
    setError('')

    // 입력 중 유효성 검사
    if (value.length === digits) {
      validateInput(value)
    }
  }

  // 입력 검증
  const validateInput = (value) => {
    if (value.length !== digits) {
      setError(`${digits}자리 숫자를 입력해주세요`)
      return false
    }

    if (!allowLeadingZero && value[0] === '0') {
      setError('0으로 시작할 수 없습니다')
      return false
    }

    // 중복 숫자 검증
    const uniqueDigits = new Set(value.split(''))
    if (uniqueDigits.size !== value.length) {
      setError('중복된 숫자는 사용할 수 없습니다')
      return false
    }

    setError('')
    return true
  }

  // 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!input) {
      setError('숫자를 입력해주세요')
      return
    }

    if (validateInput(input)) {
      onSubmit(input)
      setInput('')
      setError('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <label
          htmlFor="guess-input"
          className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300 tracking-tight"
        >
          숫자를 입력하세요 ({digits}자리)
        </label>

        <div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="guess-input"
              type="text"
              inputMode="numeric"
              value={input}
              onChange={handleInputChange}
              disabled={disabled}
              placeholder={`${'0'.repeat(digits)} 형식`}
              maxLength={digits}
              className={`
                flex-1 px-4 sm:px-5 py-3 sm:py-4 text-xl sm:text-2xl font-mono text-center rounded-xl font-bold tracking-wider
                border-2 transition-all duration-300 shadow-inner
                ${error
                  ? 'border-red-400 dark:border-red-500 bg-red-50/80 dark:bg-red-950/30 focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 text-red-700 dark:text-red-300'
                  : 'border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300/50 dark:focus:ring-indigo-700/50 backdrop-blur-sm'
                }
                disabled:bg-gray-100/80 dark:disabled:bg-gray-800/80 disabled:cursor-not-allowed
                focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600
              `}
              aria-label="숫자 추측 입력"
              aria-invalid={!!error}
              aria-describedby={error ? 'input-error' : undefined}
            />
            <button
              type="submit"
              disabled={disabled || !input || !!error}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white rounded-xl font-bold text-sm sm:text-base
                         hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-600 dark:hover:to-blue-600
                         active:scale-95 transition-all duration-300
                         disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50
                         shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/50 hover:shadow-xl hover:shadow-indigo-400/60 dark:hover:shadow-indigo-800/60
                         border border-indigo-400/30 dark:border-indigo-300/30 tracking-wide"
              aria-label="제출하기"
            >
              제출
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div
              id="input-error"
              className="mt-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 dark:border-red-400 rounded-r-xl animate-slide-up backdrop-blur-sm"
              role="alert"
            >
              <p className="text-sm font-semibold text-red-700 dark:text-red-300 transition-colors duration-300">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* 입력 진행 표시 */}
          {!error && input && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden transition-colors duration-300 shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 dark:from-indigo-400 dark:to-blue-400 h-full transition-all duration-300 shadow-sm"
                  style={{ width: `${(input.length / digits) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono font-bold transition-colors duration-300 min-w-[3rem] text-right">
                {input.length}/{digits}
              </span>
            </div>
          )}

          {/* 시도 횟수 안내 */}
          <div className="mt-4 px-4 py-2.5 bg-blue-50/80 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-900/30 backdrop-blur-sm">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center transition-colors duration-300 font-medium">
              💡 최대 {maxAttempts}번까지 추측할 수 있습니다
            </p>
          </div>
        </div>

      </div>
    </form>
  )
}

export default GuessInput
