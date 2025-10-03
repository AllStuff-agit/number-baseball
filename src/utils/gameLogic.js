/**
 * 숫자야구 게임 로직 유틸리티
 * 순수 함수로 구성되어 불변성을 유지합니다.
 */

/**
 * 최대 시도 횟수 상수
 */
const MAX_ATTEMPTS = 31;

/**
 * @typedef {Object} GameConfig
 * @property {number} digits - 자릿수 (기본: 3)
 * @property {boolean} allowLeadingZero - 0으로 시작 허용 여부 (기본: false)
 */

/**
 * @typedef {Object} JudgeResult
 * @property {number} strike - 스트라이크 개수
 * @property {number} ball - 볼 개수
 * @property {boolean} isCorrect - 정답 여부
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - 유효성 여부
 * @property {string} [error] - 에러 메시지
 */

/**
 * @typedef {Object} Attempt
 * @property {string} guess - 추측한 숫자
 * @property {JudgeResult} result - 판정 결과
 * @property {number} attemptNumber - 시도 번호
 * @property {Date} timestamp - 시도 시각
 */

/**
 * @typedef {Object} GameState
 * @property {string} secret - 정답 숫자
 * @property {Attempt[]} attempts - 시도 기록
 * @property {boolean} isFinished - 게임 종료 여부
 * @property {boolean} isWon - 승리 여부
 * @property {GameConfig} config - 게임 설정
 */

/**
 * 중복 없는 랜덤 숫자 생성
 * @param {GameConfig} config - 게임 설정
 * @returns {string} 생성된 숫자 문자열
 *
 * @example
 * generateSecret({ digits: 3, allowLeadingZero: false }) // "123"
 * generateSecret({ digits: 4, allowLeadingZero: true }) // "0123"
 */
export const generateSecret = (config) => {
  const { digits = 3, allowLeadingZero = false } = config;

  if (digits < 1 || digits > 10) {
    throw new Error('자릿수는 1에서 10 사이여야 합니다.');
  }

  const availableDigits = '0123456789'.split('');
  const result = [];

  // 첫 번째 자리: 0 허용 여부에 따라 처리
  if (!allowLeadingZero) {
    const firstDigitPool = availableDigits.slice(1); // 1-9
    const firstIndex = Math.floor(Math.random() * firstDigitPool.length);
    result.push(firstDigitPool[firstIndex]);
    availableDigits.splice(availableDigits.indexOf(firstDigitPool[firstIndex]), 1);
  }

  // 나머지 자리 생성
  while (result.length < digits) {
    const randomIndex = Math.floor(Math.random() * availableDigits.length);
    result.push(availableDigits[randomIndex]);
    availableDigits.splice(randomIndex, 1);
  }

  return result.join('');
};

/**
 * 사용자 입력 검증
 * @param {string} guess - 추측한 숫자
 * @param {GameConfig} config - 게임 설정
 * @returns {ValidationResult} 검증 결과
 *
 * @example
 * validateGuess("123", { digits: 3, allowLeadingZero: false })
 * // { isValid: true }
 *
 * validateGuess("012", { digits: 3, allowLeadingZero: false })
 * // { isValid: false, error: "0으로 시작할 수 없습니다." }
 */
export const validateGuess = (guess, config) => {
  const { digits = 3, allowLeadingZero = false } = config;

  // null 또는 undefined 체크
  if (guess == null || guess === '') {
    return {
      isValid: false,
      error: '숫자를 입력해주세요.'
    };
  }

  // 문자열로 변환
  const guessStr = String(guess).trim();

  // 길이 검증
  if (guessStr.length !== digits) {
    return {
      isValid: false,
      error: `정확히 ${digits}자리 숫자를 입력해주세요.`
    };
  }

  // 숫자만 포함 검증
  if (!/^\d+$/.test(guessStr)) {
    return {
      isValid: false,
      error: '숫자만 입력 가능합니다.'
    };
  }

  // 0으로 시작 검증
  if (!allowLeadingZero && guessStr[0] === '0') {
    return {
      isValid: false,
      error: '0으로 시작할 수 없습니다.'
    };
  }

  // 중복 숫자 검증
  const uniqueDigits = new Set(guessStr.split(''));
  if (uniqueDigits.size !== guessStr.length) {
    return {
      isValid: false,
      error: '중복된 숫자는 사용할 수 없습니다.'
    };
  }

  return { isValid: true };
};

/**
 * 스트라이크와 볼 판정
 * @param {string} secret - 정답 숫자
 * @param {string} guess - 추측한 숫자
 * @returns {JudgeResult} 판정 결과
 *
 * @example
 * judge("123", "123") // { strike: 3, ball: 0, isCorrect: true }
 * judge("123", "132") // { strike: 1, ball: 2, isCorrect: false }
 * judge("123", "456") // { strike: 0, ball: 0, isCorrect: false }
 */
export const judge = (secret, guess) => {
  if (!secret || !guess) {
    throw new Error('정답과 추측 값이 모두 필요합니다.');
  }

  if (secret.length !== guess.length) {
    throw new Error('정답과 추측 값의 길이가 같아야 합니다.');
  }

  let strike = 0;
  let ball = 0;

  const secretArr = secret.split('');
  const guessArr = guess.split('');

  // 스트라이크 계산 (위치와 숫자가 모두 일치)
  for (let i = 0; i < secretArr.length; i++) {
    if (secretArr[i] === guessArr[i]) {
      strike++;
    }
  }

  // 볼 계산 (숫자는 있지만 위치가 다름)
  for (let i = 0; i < guessArr.length; i++) {
    if (secretArr.includes(guessArr[i]) && secretArr[i] !== guessArr[i]) {
      ball++;
    }
  }

  return {
    strike,
    ball,
    isCorrect: strike === secret.length
  };
};

/**
 * 게임 초기화
 * @param {GameConfig} config - 게임 설정
 * @returns {GameState} 초기 게임 상태
 *
 * @example
 * const game = initializeGame({ digits: 3, allowLeadingZero: false });
 * // { secret: "123", attempts: [], isFinished: false, isWon: false, config: {...} }
 */
export const initializeGame = (config = {}) => {
  const gameConfig = {
    digits: config.digits || 3,
    allowLeadingZero: config.allowLeadingZero || false
  };

  const secret = generateSecret(gameConfig);

  return {
    secret,
    attempts: [],
    isFinished: false,
    isWon: false,
    config: gameConfig
  };
};

/**
 * 추측 처리 (순수 함수 - 새로운 상태 반환)
 * @param {GameState} state - 현재 게임 상태
 * @param {string} guess - 추측한 숫자
 * @returns {GameState} 새로운 게임 상태
 * @throws {Error} 유효하지 않은 입력인 경우
 *
 * @example
 * const state = initializeGame({ digits: 3, allowLeadingZero: false });
 * const newState = makeGuess(state, "123");
 * // state는 변경되지 않고, newState에 새로운 상태가 반환됨
 */
export const makeGuess = (state, guess) => {
  // 게임 종료 상태 체크
  if (state.isFinished) {
    throw new Error('게임이 이미 종료되었습니다.');
  }

  // 입력 검증
  const validation = validateGuess(guess, state.config);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // 판정
  const result = judge(state.secret, guess);

  // 새로운 시도 기록 생성
  const newAttempt = {
    guess,
    result,
    attemptNumber: state.attempts.length + 1,
    timestamp: new Date()
  };

  // 시도 횟수 체크
  const newAttempts = [...state.attempts, newAttempt];
  const isMaxAttempts = newAttempts.length >= MAX_ATTEMPTS;

  // 불변성을 유지하며 새로운 상태 반환
  return {
    ...state,
    attempts: newAttempts,
    isFinished: result.isCorrect || isMaxAttempts,
    isWon: result.isCorrect
  };
};

/**
 * 게임 상태 재설정 (순수 함수 - 새로운 상태 반환)
 * @param {GameConfig} config - 게임 설정 (선택적, 기존 설정 재사용 가능)
 * @returns {GameState} 새로운 게임 상태
 *
 * @example
 * const newGame = resetGame({ digits: 4, allowLeadingZero: true });
 */
export const resetGame = (config) => {
  return initializeGame(config);
};

/**
 * 게임 통계 계산
 * @param {GameState} state - 게임 상태
 * @returns {Object} 게임 통계
 *
 * @example
 * const stats = getGameStats(state);
 * // { totalAttempts: 5, bestResult: { strike: 2, ball: 1 }, ... }
 */
export const getGameStats = (state) => {
  if (!state || !state.attempts) {
    return {
      totalAttempts: 0,
      bestResult: null,
      averageStrike: 0,
      averageBall: 0
    };
  }

  const totalAttempts = state.attempts.length;

  if (totalAttempts === 0) {
    return {
      totalAttempts: 0,
      bestResult: null,
      averageStrike: 0,
      averageBall: 0
    };
  }

  let bestResult = state.attempts[0].result;
  let totalStrike = 0;
  let totalBall = 0;

  for (const attempt of state.attempts) {
    const { strike, ball } = attempt.result;
    totalStrike += strike;
    totalBall += ball;

    // 가장 좋은 결과 업데이트 (스트라이크 우선, 그 다음 볼)
    if (strike > bestResult.strike ||
        (strike === bestResult.strike && ball > bestResult.ball)) {
      bestResult = attempt.result;
    }
  }

  return {
    totalAttempts,
    bestResult,
    averageStrike: totalStrike / totalAttempts,
    averageBall: totalBall / totalAttempts
  };
};
