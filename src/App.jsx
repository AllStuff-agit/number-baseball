import { useState } from 'react'
import GameSettings from './components/GameSettings'
import GameBoard from './components/GameBoard'
import { useTheme } from './contexts/ThemeContext.jsx'

/**
 * 숫자야구 게임 메인 컴포넌트
 *
 * 게임 흐름:
 * 1. 게임 설정 (자릿수 선택, 첫자리 0 허용 옵션)
 * 2. 게임 진행 (추측 입력 및 결과 확인)
 * 3. 게임 종료 (성공 결과, 재시작/설정 돌아가기)
 */
function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameConfig, setGameConfig] = useState(null)
  const { isDarkMode, toggleTheme } = useTheme()

  // 게임 시작 핸들러
  const handleStartGame = (config) => {
    setGameConfig(config)
    setGameStarted(true)
  }

  // 설정 화면으로 돌아가기
  const handleGoToSettings = () => {
    setGameStarted(false)
    setGameConfig(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <header className="text-center mb-8 relative">
          {/* 다크 모드 토글 버튼 */}
          <button
            onClick={toggleTheme}
            className="absolute right-0 top-0 px-4 py-2 rounded-lg bg-white dark:bg-gray-700
                       text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg
                       transition-all duration-300 hover:scale-105 flex items-center gap-2"
            aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDarkMode ? '🌞' : '🌙'}
            <span className="text-sm font-semibold">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-300 mb-2 transition-colors duration-300">
            ⚾ 숫자야구 게임
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            중복 없는 숫자를 맞춰보세요!
          </p>
        </header>

        <main className={!gameStarted ? "max-w-2xl mx-auto" : ""}>
          {!gameStarted ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in transition-colors duration-300">
              <GameSettings onStartGame={handleStartGame} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <GameBoard
                config={gameConfig}
                onGoToSettings={handleGoToSettings}
              />
            </div>
          )}
        </main>

      </div>

      {/* 푸터 */}
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <p>숫자야구 게임 v1.0 | React + Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default App
