import { format, formatDistanceToNow, formatDistanceToNowStrict, formatRelative, isToday, isTomorrow, isValid, isYesterday, parse, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜 또는 시간 문자열을 자동으로 판단하여 포맷팅합니다.
 * 
 * @example
 * formatDateOrTime("2024-05-03") => "2024년 5월 3일 (금)"
 * formatDateOrTime("14:30:00") => "14:30"
 * formatDateOrTime("2024-05-03T14:30:00Z") => "2024년 5월 3일 (금)"
 */
export function formatDateOrTime(input: string | Date | null | undefined): string {
  if (!input) return "-";

  // MySQL TIME 문자열 처리
  if (typeof input === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(input)) {
    return formatHM(input);
  }

  // 날짜 or ISO 형식 → 한국식 날짜로 포맷
  try {
    const date = typeof input === "string" ? new Date(input) : input;
    if (isNaN(date.getTime())) return "-";
    return formatKoreanDate(date);
  } catch {
    return "-";
  }
}






/*
{
  relative: "오늘",
  date: "5월 3일 (금)",
  time: "14:00"
}
*/export type SmartDate = {
  relative: string; // 예: 오늘, 어제, 3일 전
  date: string;     // 예: 5월 3일 (금) 또는 2025년 5월 3일 (토)
  time?: string;    // 예: 14:30
};

export type SmartDateFormat = "md" | "ymd" | "hm" | "full" | string;

export interface FormatSmartDateOptions {
  format?: SmartDateFormat;
}

// 🧠 format 옵션 문자열 → date-fns 형식 포맷 문자열로 변환
function resolveFormat(format?: SmartDateFormat): string {
  switch (format) {
    case "md":
      return "M월 d일 (EEE)";
    case "ymd":
      return "yyyy년 M월 d일 (EEE)";
    case "hm":
      return "HH:mm";
    case "full":
      return "yyyy년 M월 d일 (EEE) HH:mm";
    default:
      return "yyyy년 M월 d일 (EEE)"; // 기본값
  }
}

export function formatSmartDate(
  input: Date | string | null | undefined,
  options?: FormatSmartDateOptions
): SmartDate {
  if (!input) return { relative: "-", date: "-" };

  // 📌 "yyyy-MM-dd" 인 경우 시각 없는 날짜일 수 있어서 특수 처리
  const isDateOnlyString =
    typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input);

  const date = new Date(input);

  // 🚫 유효하지 않은 날짜
  if (isNaN(date.getTime())) return { relative: "-", date: "-" };

  const dateStr = format(date, resolveFormat(options?.format), { locale: ko });
  const timeStr = format(date, "a h:mm", { locale: ko });  // a: 오전/오후, h:mm: 12시간제

  // 날짜가 오늘/어제/내일인 경우 relative 처리
  // if (isToday(date)) return { relative: "오늘", date: dateStr, time: timeStr };
  // if (isYesterday(date)) return { relative: "어제", date: dateStr, time: timeStr };
  // if (isTomorrow(date)) return { relative: "내일", date: dateStr, time: timeStr };

  const relative = formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: ko,
  });

  return {
    relative,
    date: dateStr,
    time: timeStr,
  };
}

// { relative: '8개월 후', date: '2024년 5월 3일 (금)', time: '오후 11:30' }

// // d-day 
// export function formatDDay(date: Date | string | null | undefined): string {
//   if (!date) return "-";

//   const d = typeof date === "string" ? new Date(date) : date;
//   if (isNaN(d.getTime())) return "-"; // ✅ Invalid Date 처리

//   const today = new Date();
//   const diffTime = d.getTime() - today.getTime();
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays > 0) {
//     return `${diffDays}일 후`;
//   } else if (diffDays < 0) {
//     return `${Math.abs(diffDays)}일 전`;
//   } else {
//     return "오늘";
//   }
// }









/**
 * YYYY년 M월 D일 (요일) 형식
 * @example 2024년 5월 1일 (수)
 */

export function formatKoreanDate(date: Date | string | null | undefined): string {
  if (!date) return "-";

  if (typeof date === "string") {
    // 날짜만 있는 경우
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "-";
      return format(d, "yyyy년 M월 d일(E)", { locale: ko });
    }
    // 시간까지 있는 경우
    // date-fns는 "2025-07-13T15:30:00"은 잘 파싱하지만
    // "2025-07-13 15:30:00"은 브라우저마다 다르게 동작할 수 있음
    // 안전하게 T로 변환
    const safeDate = date.replace(" ", "T");
    const d = new Date(safeDate);
    if (isNaN(d.getTime())) return "-";
    return format(d, "yyyy년 M월 d일(E) a h:mm", { locale: ko });
  }

  if (date instanceof Date) {
    if (isNaN(date.getTime())) return "-";
    return format(date, "yyyy년 M월 d일(E) a h:mm", { locale: ko });
  }

  return "-";
}

/**
 * 상대시간 표기 (몇 분 전, 몇 일 전 등)
 * @example 2일 전, 방금 전
 */
export function formatDistanceFromNow(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return formatDistanceToNow(d, { addSuffix: true, locale: ko });
}

/**
 * 상대 시간 (오늘/어제/지난 주 일요일 등)
 * @example 오늘 오후 3:45
 */
export function formatRelativeToNow(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return formatRelative(d, new Date(), { locale: ko });
}
/**
 * 다양한 형식의 시간을 "HH:mm" 형식으로 포맷팅합니다.
 * - MySQL TIME 문자열 ("14:30:00")
 * - ISO 문자열 ("2024-05-01T14:30:00.000Z")
 * - Date 객체
 * - null, undefined, 빈 문자열 처리
 */
// export function formatHM(date: string | Date | null | undefined): string {
//   if (!date || (typeof date === "string" && date.trim() === "")) return "-";

//   // ✅ MySQL TIME 형식인 경우 ("14:30:00" 또는 "14:30")
//   if (typeof date === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(date)) {
//     const [hh, mm] = date.split(":");
//     return `${hh}:${mm}`;
//   }

//   try {
//     const parsed = typeof date === "string" ? new Date(date) : date;
//     if (isNaN(parsed.getTime())) return "-";

//     return format(parsed, "HH:mm");
//   } catch {
//     return "-";
//   }
// }
export function formatHM(date: string | Date | null | undefined): string {
  if (!date || (typeof date === "string" && date.trim() === "")) return "-";

  // ✅ MySQL TIME 형식인 경우 ("14:30:00" 또는 "14:30")
  if (typeof date === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(date)) {
    const [hh, mm] = date.split(":");
    // 오전/오후 변환
    const hour = parseInt(hh, 10);
    const ampm = hour < 12 ? "오전" : "오후";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${ampm} ${hour12}:${mm}`;
  }

  try {
    const parsed = typeof date === "string" ? new Date(date) : date;
    if (isNaN(parsed.getTime())) return "-";
    // 오전/오후(한국어)로 포맷
    return format(parsed, "a h:mm", { locale: ko });
  } catch {
    return "-";
  }
}


export function __formatHM_AMPM(date: string | Date | null | undefined): string {
  if (!date || (typeof date === "string" && date.trim() === "")) return "-";

  // ✅ MySQL TIME 형식인 경우 ("14:30:00" 또는 "14:30")
  if (typeof date === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(date)) {
    const [hh, mm] = date.split(":");
    // 오전/오후 변환
    const hour = parseInt(hh, 10);
    const ampm = hour < 12 ? "오전" : "오후";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${ampm} ${hour12}:${mm}`;
  }

  try {
    const parsed = typeof date === "string" ? new Date(date) : date;
    if (isNaN(parsed.getTime())) return "-";
    // 오전/오후(한국어)로 포맷
    return format(parsed, "a h:mm", { locale: ko });
  } catch {
    return "-";
  }
}


/**
 * ✅ ISO → MySQL DATE ("YYYY-MM-DD")
 * ex: "2025-06-02T00:00:00.000Z" → "2025-06-02"
 */
export function formatAsDateOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

/**
 * 유지보수성, 국제화 대응, 정확성 측면에서 우위
 * 이미 Calendar, format, parse에 date-fns를 쓰고 있다면 일관되게 같은 유틸을 사용하는 것이 좋습니다
 * ✅ "YYYY-MM-DD" 문자열 → Date 객체
 * ex: "2025-06-02" → Date
 */
export function parseDateOnly(dateStr: string): Date | null {
  const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? parsed : null;
}

/**
 * ✅ Date 객체 → "YYYY-MM-DD" 문자열
 * ex: new Date() → "2025-06-02"
 */
export function dateToDateOnlyString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function stringToMySQLDateOnly(isoString: string): string {
  return isoString.slice(0, 10); // "YYYY-MM-DD"
}









/**
 * ✅ ISO → MySQL DATETIME ("YYYY-MM-DD HH:mm:ss")
 * ex: "2025-06-02T14:30:00.000Z" → "2025-06-02 14:30:00"
 */
export function formatAsDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return '';
  }
}

/**
 * ✅ "YYYY-MM-DD HH:mm:ss" 문자열 → Date 객체
 * ex: "2025-06-02 14:30:00" → Date
 */
export function parseDateTime(dateTimeStr: string): Date | null {
  const parsed = parse(dateTimeStr, 'yyyy-MM-dd HH:mm:ss', new Date());
  return isValid(parsed) ? parsed : null;
}

/**
 * ✅ Date 객체 → "YYYY-MM-DD HH:mm:ss" 문자열
 * ex: new Date() → "2025-06-02 14:30:00"
 */
export function dateToDateTimeString(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

// 남은 개월 및 일, 시간, 분, 초 계산 함수
export function getTimeLeft(target: Date) {
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) return { expired: true, text: '만료됨' };

  // 각 단위별로 계산
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  // "개월"과 "일"은 날짜 계산이므로 좀 더 정교하게 계산
  let months = 0, days = 0;
  let temp = new Date(now);
  while (temp < target) {
    const next = new Date(temp);
    next.setMonth(next.getMonth() + 1);
    if (next <= target) {
      months++;
      temp = next;
    } else {
      break;
    }
  }
  while (temp < target) {
    const next = new Date(temp);
    next.setDate(next.getDate() + 1);
    if (next <= target) {
      days++;
      temp = next;
    } else {
      break;
    }
  }

  let text = '';
  if (months > 0) text += `${months}개월 `;
  if (days > 0) text += `${days}일 `;
  if (hours > 0) text += `${hours}시간 `;
  if (minutes > 0 || hours > 0) text += `${minutes}분 `;
  text += `${seconds}초`;

  return { expired: false, text: text.trim() };
}


// 남은 개월 및 일, 시간, 분, 초 계산 함수
/**
 * 종료일(enddate)까지 남은 D-day, 시간, 분 계산
 *  - 1일 이상: 남은 일수 표시
 *  - 1일 미만: "0시간 남음"
 *  - 1시간 미만: "0분 남음"
 *  - 이미 만료: "종료"
 */
export const getTimeLeftDisplay = (enddate: string | Date | null | undefined): string => {
  if (!enddate) return "종료";

  // Date 파싱
  let target: Date;
  if (typeof enddate === "string") {
    target = /^\d{4}-\d{2}-\d{2}$/.test(enddate)
      ? parse(enddate, "yyyy-MM-dd", new Date())
      : new Date(enddate);
  } else if (enddate instanceof Date) {
    target = enddate;
  } else {
    return "종료";
  }

  if (isNaN(target.getTime())) return "종료";

  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) return "종료";

  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diffDays >= 1) return `${diffDays}일 남음`;

  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  if (diffHours >= 1) return `${diffHours}시간 남음`;

  const diffMinutes = Math.floor(diff / (1000 * 60));
  return `${diffMinutes}분 남음`;
};



// utils/dateUtils.ts 등
export function isSameDay(date1?: string, date2?: string): boolean {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

// import {
//   format,
//   formatDistanceToNow,
//   formatRelative,
//   parseISO,
// } from "date-fns";
// import { ko } from "date-fns/locale";
// import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";

// const KOREA_TZ = "Asia/Seoul";

// /**
//  * 🇰🇷 한국시간으로 "YYYY년 M월 D일 (요일)" 포맷
//  */
// export function formatKoreanDate(date: Date | string) {
//   const d = toDateKST(date);
//   return formatInTimeZone(d, KOREA_TZ, "yyy년 M월 d일(E) a h:mm", { locale: ko });
// }

// /**
//  * 🇰🇷 한국시간 기준 상대 시간 (몇 일 전 등)
//  */
// export function formatDistanceFromNow(date: Date | string) {
//   const d = toDateKST(date);
//   return formatDistanceToNow(d, { addSuffix: true, locale: ko });
// }

// /**
//  * 🇰🇷 한국시간 기준 상대 표현 (오늘, 지난 일요일 등)
//  */
// export function formatRelativeToNow(date: Date | string) {
//   const d = toDateKST(date);
//   return formatRelative(d, new Date(), { locale: ko });
// }

// /**
//  * 🇰🇷 한국시간 기준 ISO 포맷 출력
//  * @example 2024-05-01 14:30:00
//  */
// export function formatKST(date: Date | string, formatStr = "yyyy-MM-dd HH:mm:ss") {
//   const d = toDateKST(date);
//   return formatInTimeZone(d, KOREA_TZ, formatStr, { locale: ko });
// }

// /**
//  * 문자열 or Date → KST Date 객체로 변환
//  */
// export function toDateKST(date: Date | string): Date {
//   const parsed = typeof date === "string" ? parseISO(date) : date;
//   return new Date(parsed.getTime() + 9 * 60 * 60 * 1000); // UTC → KST (+9h)
// }
