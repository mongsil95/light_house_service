import beachData from "@/docs/참고자료/beach_list.json";
import type { Beach, BeachWithDistance, Region } from "@/types/beach";

// 해변 데이터를 Beach 타입으로 변환
export const beaches: Beach[] = beachData as Beach[];

// 고유한 시/도 목록 추출
export const getCities = (): string[] => {
  const cities = new Set<string>();
  beaches.forEach((beach) => {
    const city = beach["관리처\n(시,도)"];
    if (city && city !== "-" && city !== "") {
      cities.add(city);
    }
  });
  return Array.from(cities).sort();
};

// 특정 시/도의 군/구 목록 추출
export const getDistricts = (city: string): string[] => {
  const districts = new Set<string>();
  beaches
    .filter((beach) => beach["관리처\n(시,도)"] === city)
    .forEach((beach) => {
      const district = beach["관리처\n(군,구)"];
      if (district && district !== "-" && district !== "") {
        districts.add(district);
      }
    });
  return Array.from(districts).sort();
};

// 행정구역으로 해변 필터링
export const filterBeachesByRegion = (region: Region): Beach[] => {
  return beaches.filter((beach) => {
    const cityMatch = !region.city || beach["관리처\n(시,도)"] === region.city;
    const districtMatch = !region.district || beach["관리처\n(군,구)"] === region.district;
    return cityMatch && districtMatch;
  });
};

// 해변명으로 검색
export const searchBeachesByName = (query: string): Beach[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase().trim();
  return beaches.filter((beach) => beach.name.toLowerCase().includes(lowerQuery));
};

// 주소를 좌표로 변환하는 함수 (Kakao Maps API 사용)
export const geocodeAddress = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

  if (!KAKAO_API_KEY) {
    console.warn("Kakao REST API Key가 설정되지 않았습니다. 대략적인 좌표를 사용합니다.");
    return estimateCoordinatesFromAddress(address);
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding API 호출 실패");
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const location = data.documents[0];
      return {
        lat: parseFloat(location.y),
        lng: parseFloat(location.x),
      };
    }

    // 주소로 찾지 못한 경우 키워드 검색 시도
    const keywordResponse = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    const keywordData = await keywordResponse.json();

    if (keywordData.documents && keywordData.documents.length > 0) {
      const location = keywordData.documents[0];
      return {
        lat: parseFloat(location.y),
        lng: parseFloat(location.x),
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return estimateCoordinatesFromAddress(address);
  }
};

// 두 좌표 간의 거리 계산 (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 주소에서 대략적인 좌표 추정 (Kakao API 사용 불가능할 때 백업용)
export const estimateCoordinatesFromAddress = (
  address: string
): { lat: number; lng: number } | null => {
  // 더 정교한 매핑 (데모용/백업용)
  const regionCoordinates: { [key: string]: { lat: number; lng: number } } = {
    // 광역시/도
    서울: { lat: 37.5665, lng: 126.978 },
    인천: { lat: 37.4563, lng: 126.7052 },
    경기: { lat: 37.4138, lng: 127.5183 },
    강원: { lat: 37.8228, lng: 128.1555 },
    충남: { lat: 36.5184, lng: 126.8 },
    충북: { lat: 36.8, lng: 127.7 },
    충청남도: { lat: 36.5184, lng: 126.8 },
    충청북도: { lat: 36.8, lng: 127.7 },
    전남: { lat: 34.8679, lng: 126.991 },
    전북: { lat: 35.7175, lng: 127.153 },
    전라남도: { lat: 34.8679, lng: 126.991 },
    전라북도: { lat: 35.7175, lng: 127.153 },
    경남: { lat: 35.4606, lng: 128.2132 },
    경북: { lat: 36.4919, lng: 128.8889 },
    경상남도: { lat: 35.4606, lng: 128.2132 },
    경상북도: { lat: 36.4919, lng: 128.8889 },
    울산: { lat: 35.5384, lng: 129.3114 },
    부산: { lat: 35.1796, lng: 129.0756 },
    제주: { lat: 33.4996, lng: 126.5312 },
  };

  // 주소에서 지역명 찾기
  for (const [region, coords] of Object.entries(regionCoordinates)) {
    if (address.includes(region)) {
      return coords;
    }
  }

  return null;
};

// 가장 가까운 해변 찾기
export const findNearestBeaches = async (
  address: string,
  limit: number = 10
): Promise<BeachWithDistance[]> => {
  // 주소를 좌표로 변환 (Kakao API 또는 추정)
  const coords = await geocodeAddress(address);

  if (!coords) {
    console.warn("좌표를 찾을 수 없습니다:", address);
    return [];
  }

  console.log("입력 주소 좌표:", coords);

  // 각 해변에 대해 거리 계산
  const beachesWithDistance: BeachWithDistance[] = [];

  for (const beach of beaches) {
    // 해변 주소에서 좌표 추정 (해변은 Kakao API 사용하지 않고 빠른 추정 사용)
    const beachCoords = estimateCoordinatesFromAddress(beach.addr);

    if (!beachCoords) {
      continue;
    }

    const distance = calculateDistance(coords.lat, coords.lng, beachCoords.lat, beachCoords.lng);

    beachesWithDistance.push({ ...beach, distance });
  }

  // 거리순으로 정렬하여 상위 결과 반환
  return beachesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0)).slice(0, limit);
};
