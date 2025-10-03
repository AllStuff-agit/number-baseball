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
    <div className="min-h-screen relative flex flex-col overflow-x-hidden">
      {/* Background with radial gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-950/40"></div>
      </div>

      <div className="container relative mx-auto px-4 py-8 sm:py-12 flex-1">
        <header className="text-center mb-12 relative">
          {/* 다크 모드 토글 버튼 */}
          <button
            onClick={toggleTheme}
            className="absolute right-0 top-0 px-5 py-2.5 rounded-xl
                       bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                       text-gray-700 dark:text-gray-200
                       shadow-lg shadow-gray-200/50 dark:shadow-gray-950/50
                       hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50
                       transition-all duration-300 hover:scale-105
                       flex items-center gap-2.5 border border-gray-200/50 dark:border-gray-700/50"
            aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDarkMode ? '🌞' : '🌙'}
            <span className="text-sm font-semibold tracking-wide">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <div className="animate-slide-up">
            <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 mb-3 tracking-tight">
              ⚾ 숫자야구 게임
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
              중복 없는 숫자를 맞춰보세요!
            </p>
          </div>
        </header>

        <main className={!gameStarted ? "max-w-2xl mx-auto" : ""}>
          {!gameStarted ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 p-8 animate-scale-in border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
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
      <footer className="relative text-center py-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 backdrop-blur-sm">
        <p className="font-medium">숫자야구 게임 v1.0 | React + Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default App
