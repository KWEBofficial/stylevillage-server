/**
 * Enum 값들 중 하나인지 확인하는 함수.
 *
 * @param value - 검증하려는 값.
 * @param type - Enum
 * @returns {boolean} 값이 Enum에 속하면 true, 그렇지 않으면 false 반환.
 *
 * @example
 * ```typescript
 * enum Season {
 * SPRING = '봄',
 * SUMMER = '여름',
 * FALL = '가을',
 * WINTER = '겨울',
 * }
 * isInEnum("겨울", Season) -> true
 * ```
 */
function isInEnum<T extends object>(
  value: string | number,
  type: T,
): type is T {
  return Object.values(type).includes(value);
}

export default isInEnum;
