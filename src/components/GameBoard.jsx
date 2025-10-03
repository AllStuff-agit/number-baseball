import { useState } from 'react'
import GuessInput from './GuessInput'
import GuessHistory from './GuessHistory'
import GameResult from './GameResult'
import NumberAnalyzer from './NumberAnalyzer'
import { initializeGame, makeGuess } from '../utils/gameLogic'

/**
 * GameBoard 컴포넌트
 *
 * 게임 진행 중 메인 보드
 * - 게임 상태 관리
 * - GuessInput, GuessHistory 컴포넌트 통합
 * - GameResult 모달 표시
 *
 * @param {Object} props
 * @param {Object} props.config - 게임 설정 {digits, allowLeadingZero}
 * @param {Function} props.onGoToSettings - 설정 화면으로 이동
 */
function GameBoard({ config, onGoToSettings }) {
  const [gameState, setGameState] = useState(() => initializeGame(config))

  // 추측 제출 처리
  const handleGuessSubmit = (guess) => {
    try {
      const newState = makeGuess(gameState, guess)
      setGameState(newState)
    } catch (error) {
      alert(error.message)
    }
  }

  // 게임 재시작 (같은 설정)
  const handleRestart = () => {
    setGameState(initializeGame(config))
  }

  return (
    <div>
      {/* 데스크톱: 3:2 가로 배치, 모바일: 세로 배치 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:items-start">
        {/* 왼쪽: 추측 기록 (3/5 = 60%) */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <GuessHistory attempts={gameState.attempts} />
        </div>

        {/* 오른쪽: 게임 정보 + 입력 폼 (2/5 = 40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 게임 정보 헤더 */}
          <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 transition-colors duration-300">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">자릿수</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">{config.digits}자리</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">시도 횟수</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">{gameState.attempts.length}회</p>
            </div>
            <button
              onClick={onGoToSettings}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold
                         hover:bg-gray-100 dark:hover:bg-gray-600 active:scale-95 transition-all duration-300 border-2 border-gray-300 dark:border-gray-600"
              aria-label="다시 시작하기"
            >
              🔄 새 게임
            </button>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <GuessInput
              digits={config.digits}
              allowLeadingZero={config.allowLeadingZero}
              onSubmit={handleGuessSubmit}
              disabled={gameState.isFinished}
            />
          </div>

          {/* 숫자 메모 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <NumberAnalyzer config={config} />
          </div>
        </div>
      </div>

      {/* 게임 종료 모달 */}
      {gameState.isFinished && (
        <GameResult
          isWon={gameState.isWon}
          attempts={gameState.attempts.length}
          answer={gameState.secret}
          onRestart={handleRestart}
          onGoToSettings={onGoToSettings}
        />
      )}
    </div>
  )
}

export default GameBoard
