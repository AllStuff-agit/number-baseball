import { useState } from 'react'

/**
 * NumberAnalyzer 컴포넌트
 *
 * 0~9 숫자를 표시하고 사용자가 직접 클릭하여 상태를 표시할 수 있음
 * - 클릭으로 상태 변경: 미확인 → 제외 → 가능 → 확정 → 미확인
 * - 확정/가능 상태일 때 위치 선택 가능
 *
 * @param {Object} props
 * @param {Object} props.config - 게임 설정
 */
function NumberAnalyzer({ config }) {
  const { digits = 3 } = config

  // 각 숫자(0-9)의 상태를 관리
  // status: 'unknown' | 'excluded' | 'possible' | 'confirmed'
  // positions: 확정/가능한 위치 배열 (0-based index)
  const [numberStates, setNumberStates] = useState(() => {
    const initial = {}
    for (let i = 0; i <= 9; i++) {
      initial[i] = { status: 'unknown', positions: [] }
    }
    return initial
  })

  // 선택된 숫자 (위치 선택 모드용)
  const [selectedDigit, setSelectedDigit] = useState(null)

  // 숫자 클릭 핸들러
  const handleDigitClick = (digit) => {
    const currentState = numberStates[digit]

    // 가능/확정 상태이고 이미 선택된 숫자가 아니면 위치 선택 UI만 표시
    if ((currentState.status === 'possible' || currentState.status === 'confirmed') && selectedDigit !== digit) {
      setSelectedDigit(digit)
      return
    }

    // 상태 순환: unknown → excluded → possible → confirmed → unknown
    let newStatus
    switch (currentState.status) {
      case 'unknown':
        newStatus = 'excluded'
        break
      case 'excluded':
        newStatus = 'possible'
        break
      case 'possible':
        newStatus = 'confirmed'
        break
      case 'confirmed':
        newStatus = 'unknown'
        break
      default:
        newStatus = 'unknown'
    }

    setNumberStates({
      ...numberStates,
      [digit]: {
        status: newStatus,
        positions: newStatus === 'excluded' || newStatus === 'unknown' ? [] : currentState.positions
      }
    })

    // possible/confirmed 상태로 변경되면 위치 선택 모드 활성화
    if (newStatus === 'possible' || newStatus === 'confirmed') {
      setSelectedDigit(digit)
    } else {
      setSelectedDigit(null)
    }
  }

  // 위치 토글 핸들러
  const handlePositionToggle = (digit, position) => {
    const currentState = numberStates[digit]
    const positions = currentState.positions || []

    let newPositions
    if (positions.includes(position)) {
      newPositions = positions.filter(p => p !== position)
    } else {
      // confirmed는 하나만, possible은 여러 개 가능
      if (currentState.status === 'confirmed') {
        newPositions = [position]
      } else {
        newPositions = [...positions, position]
      }
    }

    setNumberStates({
      ...numberStates,
      [digit]: {
        ...currentState,
        positions: newPositions
      }
    })
  }

  // 숫자 상태에 따른 스타일
  const getNumberClass = (digit) => {
    const state = numberStates[digit]

    switch (state.status) {
      case 'excluded':
        return 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 line-through opacity-50'
      case 'confirmed':
        return 'bg-green-500 dark:bg-green-600 text-white font-bold ring-4 ring-green-300 dark:ring-green-700'
      case 'possible':
        return 'bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-white font-semibold ring-2 ring-yellow-500 dark:ring-yellow-400'
      default:
        return 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-500 hover:border-indigo-400 dark:hover:border-indigo-500'
    }
  }

  // 상태 레이블 생성
  const getStatusLabel = (digit) => {
    const state = numberStates[digit]

    switch (state.status) {
      case 'excluded':
        return '제외'
      case 'confirmed':
        if (state.positions.length > 0) {
          return `${state.positions.map(p => p + 1).join(',')}번째 확정`
        }
        return '확정'
      case 'possible':
        if (state.positions.length > 0) {
          return `${state.positions.map(p => p + 1).join(',')}번째 가능`
        }
        return '가능'
      default:
        return ''
    }
  }

  return (
    <div className="mb-6 max-h-[60vh] overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
          숫자 메모
        </h3>
        <button
          onClick={() => {
            const initial = {}
            for (let i = 0; i <= 9; i++) {
              initial[i] = { status: 'unknown', positions: [] }
            }
            setNumberStates(initial)
            setSelectedDigit(null)
          }}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
        >
          초기화
        </button>
      </div>

      {/* 숫자 그리드 */}
      <div className="grid grid-cols-10 gap-2 mb-4 px-2">
        {Array.from({ length: 10 }, (_, i) => i).map((digit) => {
          const label = getStatusLabel(digit)
          const isSelected = selectedDigit === digit

          return (
            <div key={digit} className="flex flex-col items-center">
              {/* 숫자 */}
              <button
                onClick={() => handleDigitClick(digit)}
                className={`
                  w-full aspect-square rounded-lg flex items-center justify-center
                  text-lg font-bold transition-all duration-300
                  ${getNumberClass(digit)}
                  ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-105'}
                  cursor-pointer
                `}
                title="클릭하여 상태 변경"
              >
                {digit}
              </button>

              {/* 상태 레이블 */}
              <div className="mt-1 text-[10px] text-center text-gray-600 dark:text-gray-400 transition-colors duration-300 leading-tight h-6 flex items-center justify-center">
                {label}
              </div>
            </div>
          )
        })}
      </div>

      {/* 위치 선택 UI */}
      {selectedDigit !== null && (numberStates[selectedDigit].status === 'possible' || numberStates[selectedDigit].status === 'confirmed') && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 transition-colors duration-300 mb-4">
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedDigit}</span>의 위치 선택:
          </p>
          <div className="flex gap-2">
            {Array.from({ length: digits }, (_, i) => i).map((position) => {
              const isActive = numberStates[selectedDigit].positions.includes(position)

              return (
                <button
                  key={position}
                  onClick={() => handlePositionToggle(selectedDigit, position)}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                    ${isActive
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600'
                    }
                    hover:scale-105 active:scale-95
                  `}
                >
                  {position + 1}번째
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600 ring-2 ring-green-300 dark:ring-green-700"></div>
          <span>확정 (클릭 3회)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-400 dark:bg-yellow-600 ring-1 ring-yellow-500 dark:ring-yellow-400"></div>
          <span>가능 (클릭 2회)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600 opacity-50"></div>
          <span>제외 (클릭 1회)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500"></div>
          <span>미확인</span>
        </div>
      </div>
    </div>
  )
}

export default NumberAnalyzer
