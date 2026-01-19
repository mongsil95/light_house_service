// 해변 데이터 타입 정의
export interface Beach {
  id: number;
  name: string;
  addr: string;
  "관리처\n(시,도)": string;
  "관리처\n(군,구)": string;
}

// 검색 모드
export type SearchMode = "location" | "region" | "name";

// 행정구역 타입
export interface Region {
  city: string;
  district: string;
}

// 거리 정보가 포함된 해변 타입
export interface BeachWithDistance extends Beach {
  distance?: number;
}
