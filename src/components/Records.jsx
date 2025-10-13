import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Records 컴포넌트
 *
 * 게임 기록을 자릿수별로 보여주는 페이지
 * - 탭으로 3자리, 4자리, 5자리, 6자리 전환
 * - 시도 횟수 적은 순 → 시간 짧은 순으로 정렬
 * - 상위 10개 기록 표시
 *
 * @param {Object} props
 * @param {Function} props.onBack - 뒤로가기 콜백
 */
function Records({ onBack }) {
  const [selectedDigit, setSelectedDigit] = useState(3)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 기록 불러오기
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true)
      setError(null)

      try {
        const tableName = `records_${selectedDigit}digit`
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('attempts', { ascending: true })
          .order('duration_seconds', { ascending: true })
          .limit(10)

        if (error) throw error
        setRecords(data || [])
      } catch (err) {
        console.error('Error fetching records:', err)
        setError('기록을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [selectedDigit])

  // 플레이 시간 포맷팅 (초 -> 분:초)
  const formatPlayTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}분 ${secs}초` : `${secs}초`
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="h-screen relative flex flex-col overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-950/40"></div>
      </div>

      <div className="container relative mx-auto px-4 py-8 sm:py-12 h-full flex flex-col">
        {/* 헤더 */}
        <header className="text-center mb-8 relative flex-shrink-0">
          <button
            onClick={onBack}
            className="absolute left-0 top-0 px-2 py-1.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl
                       bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                       text-gray-700 dark:text-gray-200
                       shadow-lg shadow-gray-200/50 dark:shadow-gray-950/50
                       hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50
                       transition-all duration-300 hover:scale-105
                       border border-gray-200/50 dark:border-gray-700/50 font-bold text-[10px] sm:text-lg"
            aria-label="뒤로가기"
          >
            ← 돌아가기
          </button>

          <div>
            <h1 className="text-4xl sm:text-6xl font-black mb-3 tracking-tight flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-5xl">🏆</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">
                명예의 전당
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
              Top Players
            </p>
          </div>
        </header>

        {/* 자릿수 탭 */}
        <div className="max-w-4xl mx-auto mb-6 flex-shrink-0">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 p-2 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((digit) => (
                <button
                  key={digit}
                  onClick={() => setSelectedDigit(digit)}
                  className={`
                    py-3 px-4 rounded-xl font-bold transition-all duration-300 text-base
                    ${selectedDigit === digit
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/50 scale-105'
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                  aria-label={`${digit}자리 기록 보기`}
                  aria-pressed={selectedDigit === digit}
                >
                  {digit}자리
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 기록 목록 */}
        <main className="max-w-4xl mx-auto flex-1 flex flex-col min-h-0 w-full">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300 flex flex-col h-full">
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 px-6 pt-5 pb-4 transition-colors duration-300 flex-shrink-0">
              {selectedDigit}자리 숫자 TOP 10
            </h2>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {loading ? (
                <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">로딩 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 font-medium text-lg mb-2">⚠️</p>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-6xl mb-4">📝</p>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
                  아직 기록이 없습니다
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  첫 번째 기록의 주인공이 되어보세요!
                </p>
              </div>
            ) : (
                <div className="space-y-3">
                  {records.map((record, index) => (
                    <div
                      key={record.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                        ${index === 0
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400 dark:border-yellow-600 shadow-lg'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700/30 dark:to-slate-700/30 border-2 border-gray-400 dark:border-gray-500'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-2 border-orange-400 dark:border-orange-600'
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border border-gray-200 dark:border-gray-700'
                        }
                      `}
                    >
                      {/* 순위 */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {index === 0 ? (
                          <span className="text-3xl">🥇</span>
                        ) : index === 1 ? (
                          <span className="text-3xl">🥈</span>
                        ) : index === 2 ? (
                          <span className="text-3xl">🥉</span>
                        ) : (
                          <span className="text-xl font-black text-gray-600 dark:text-gray-400">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* 플레이어 이름 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-gray-800 dark:text-gray-100 truncate transition-colors duration-300">
                          {record.player_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          {formatDate(record.created_at)}
                        </p>
                      </div>

                      {/* 통계 */}
                      <div className="flex gap-6 text-center">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider transition-colors duration-300">
                            시도
                          </p>
                          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                            {record.attempts}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider transition-colors duration-300">
                            시간
                          </p>
                          <p className="text-lg font-black text-blue-600 dark:text-blue-400 transition-colors duration-300">
                            {formatPlayTime(record.duration_seconds)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Records
