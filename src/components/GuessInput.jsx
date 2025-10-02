import { useState } from 'react'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="guess-input"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
        >
          숫자를 입력하세요 ({digits}자리)
        </label>
        <div className="flex gap-2">
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
              flex-1 px-4 py-3 text-xl font-mono text-center rounded-lg
              border-2 transition-all duration-300
              ${error
                ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800'
              }
              disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
              focus:outline-none
            `}
            aria-label="숫자 추측 입력"
            aria-invalid={!!error}
            aria-describedby={error ? 'input-error' : undefined}
          />
          <button
            type="submit"
            disabled={disabled || !input || !!error}
            className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-semibold
                       hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-95 transition-all duration-300
                       disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100
                       shadow-md hover:shadow-lg"
            aria-label="제출하기"
          >
            제출
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p
            id="input-error"
            className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in transition-colors duration-300"
            role="alert"
          >
            ⚠️ {error}
          </p>
        )}

        {/* 입력 진행 표시 */}
        {!error && input && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden transition-colors duration-300">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(input.length / digits) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono transition-colors duration-300">
              {input.length}/{digits}
            </span>
          </div>
        )}
      </div>
    </form>
  )
}

export default GuessInput
