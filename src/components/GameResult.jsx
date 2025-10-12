import { useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * GameResult 컴포넌트
 *
 * 게임 종료 결과를 표시하는 모달
 * - 성공/실패 메시지
 * - 시도 횟수 및 정답 공개
 * - 재시작/처음으로 버튼
 *
 * @param {Object} props
 * @param {boolean} props.isWon - 게임 승리 여부
 * @param {number} props.attempts - 총 시도 횟수
 * @param {string} props.answer - 정답
 * @param {number} props.playTime - 플레이 시간 (초)
 * @param {number} props.digits - 자릿수
 * @param {Function} props.onRestart - 같은 설정으로 재시작
 * @param {Function} props.onGoToSettings - 설정 화면으로 이동
 */
function GameResult({ isWon, attempts, answer, playTime, digits, onRestart, onGoToSettings }) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSaved, setHasSaved] = useState(false) // 저장 완료 여부

  // 기록 저장 핸들러
  const handleSaveRecord = async () => {
    if (!playerName.trim()) {
      setErrorMessage('플레이어 이름을 입력해주세요.')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const tableName = `records_${digits}digit`
      const { error } = await supabase
        .from(tableName)
        .insert({
          player_name: playerName.trim(),
          answer: answer,
          attempts: attempts,
          duration_seconds: playTime
        })

      if (error) {
        if (error.code === '23505') { // UNIQUE violation
          setErrorMessage('이미 등록된 플레이어 이름입니다.')
        } else {
          setErrorMessage('기록 저장에 실패했습니다. 다시 시도해주세요.')
        }
        setSaveStatus('error')
      } else {
        setSaveStatus('success')
        setHasSaved(true) // 저장 완료 표시
        setTimeout(() => {
          setShowSaveModal(false)
          setSaveStatus(null)
          setPlayerName('')
        }, 2000)
      }
    } catch (err) {
      setErrorMessage('네트워크 오류가 발생했습니다.')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  // 플레이 시간 포맷팅 (초 -> 분:초)
  const formatPlayTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
  }
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in transition-colors duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 sm:p-10 animate-scale-in border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        {/* 승리/패배 아이콘 */}
        <div className="text-center mb-8">
          {isWon ? (
            <div className="text-7xl mb-5 animate-bounce">🎉</div>
          ) : (
            <div className="text-7xl mb-5">😢</div>
          )}

          <h2 className={`text-4xl font-black mb-3 transition-colors duration-300 tracking-tight ${
            isWon ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {isWon ? '정답입니다!' : '게임 종료'}
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300 font-medium">
            {isWon
              ? `${attempts}번 만에 맞추셨습니다!`
              : `${attempts}번의 시도 끝에 실패했습니다.`
            }
          </p>
          {!isWon && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
              다시 도전해보세요!
            </p>
          )}
        </div>

        {/* 정답 표시 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl p-8 mb-8 border border-indigo-200/50 dark:border-indigo-800/50 transition-colors duration-300 shadow-inner">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 text-center mb-3 transition-colors duration-300 tracking-wider uppercase">정답</p>
          <p className="text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 text-center tracking-widest transition-colors duration-300">
            {answer}
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50 transition-colors duration-300 backdrop-blur-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300 tracking-wider uppercase">시도</p>
            <p className="text-2xl font-black text-gray-800 dark:text-gray-100 transition-colors duration-300">{attempts}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50 transition-colors duration-300 backdrop-blur-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300 tracking-wider uppercase">자릿수</p>
            <p className="text-2xl font-black text-gray-800 dark:text-gray-100 transition-colors duration-300">{answer.length}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-700/50 rounded-2xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50 transition-colors duration-300 backdrop-blur-sm">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300 tracking-wider uppercase">시간</p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100 transition-colors duration-300">{formatPlayTime(playTime)}</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          {isWon && !showSaveModal && !hasSaved && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white py-4 rounded-2xl font-bold text-base
                         hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600
                         active:scale-[0.98] transition-all duration-300
                         shadow-xl shadow-green-300/50 dark:shadow-green-900/50 hover:shadow-2xl hover:shadow-green-400/60 dark:hover:shadow-green-800/60
                         border border-green-400/30 dark:border-green-300/30 tracking-wide"
              aria-label="기록 저장하기"
            >
              📝 기록 저장하기
            </button>
          )}

          {isWon && hasSaved && (
            <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 py-4 rounded-2xl font-bold text-base
                           shadow-md border border-gray-300/50 dark:border-gray-500/50 text-center
                           text-gray-600 dark:text-gray-300 transition-colors duration-300">
              ✅ 기록이 저장되었습니다
            </div>
          )}

          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white py-4 rounded-2xl font-bold text-base
                       hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-600 dark:hover:to-blue-600
                       active:scale-[0.98] transition-all duration-300
                       shadow-xl shadow-indigo-300/50 dark:shadow-indigo-900/50 hover:shadow-2xl hover:shadow-indigo-400/60 dark:hover:shadow-indigo-800/60
                       border border-indigo-400/30 dark:border-indigo-300/30 tracking-wide"
            aria-label="다시 시작하기"
          >
            다시 시작
          </button>

          <button
            onClick={onGoToSettings}
            className="w-full bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-bold text-base
                       hover:bg-white dark:hover:bg-gray-700 active:scale-[0.98] transition-all duration-300
                       border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg backdrop-blur-sm tracking-wide"
            aria-label="새 게임 시작하기"
          >
            🆕 새 게임
          </button>
        </div>
      </div>

      {/* 기록 저장 모달 */}
      {showSaveModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-10 animate-fade-in">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300 animate-scale-in">
            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4 text-center transition-colors duration-300">
              기록 저장
            </h3>

            {saveStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">✅</div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  저장 완료!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    플레이어 이름
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRecord()}
                    placeholder="이름을 입력하세요"
                    maxLength={50}
                    disabled={isSaving}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                               focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                               transition-colors duration-300 font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errorMessage && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                      {errorMessage}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSaveModal(false)
                      setPlayerName('')
                      setErrorMessage('')
                      setSaveStatus(null)
                    }}
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                               rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600
                               active:scale-95 transition-all duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveRecord}
                    disabled={isSaving || !playerName.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500
                               text-white rounded-xl font-bold
                               hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-600 dark:hover:to-blue-600
                               active:scale-95 transition-all duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed
                               shadow-lg"
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GameResult
