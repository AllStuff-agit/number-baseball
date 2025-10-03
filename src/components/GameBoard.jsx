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
        <div className="lg:col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
          <GuessHistory attempts={gameState.attempts} />
        </div>

        {/* 오른쪽: 게임 정보 + 입력 폼 (2/5 = 40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 게임 정보 헤더 */}
          <div className="flex items-center justify-between bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30 transition-colors duration-300 shadow-sm backdrop-blur-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors duration-300 tracking-wider uppercase">자릿수</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 transition-colors duration-300">{config.digits}자리</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors duration-300 tracking-wider uppercase">시도 횟수</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 transition-colors duration-300">{gameState.attempts.length}회</p>
            </div>
            <button
              onClick={onGoToSettings}
              className="px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold
                         hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all duration-300 border-2 border-gray-200 dark:border-gray-600
                         shadow-md hover:shadow-lg backdrop-blur-sm tracking-tight"
              aria-label="다시 시작하기"
            >
              🔄 새 게임
            </button>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 p-6 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
            <GuessInput
              digits={config.digits}
              allowLeadingZero={config.allowLeadingZero}
              onSubmit={handleGuessSubmit}
              disabled={gameState.isFinished}
            />
          </div>

          {/* 숫자 메모 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 p-6 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
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
