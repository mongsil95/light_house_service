"use client";

import { BeachMapDialog } from "@/components/BeachMapDialog";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  filterBeachesByRegion,
  findNearestBeaches,
  getCities,
  getDistricts,
  searchBeachesByName,
} from "@/lib/beachFinderUtils";
import type { Beach, BeachWithDistance, Region } from "@/types/beach";
import {
  ArrowLeft,
  Car,
  Copy,
  Download,
  List,
  MapPin,
  Navigation as NavigationIcon,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function BeachFinderPage() {
  const [searchMode, setSearchMode] = useState<"location" | "region" | "name">("location");

  // 위치 기반 검색
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCoords, setCompanyCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestBeaches, setNearestBeaches] = useState<BeachWithDistance[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [drivingTimes, setDrivingTimes] = useState<Record<number, number>>({});

  // 행정구역 기반 검색
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    city: "",
    district: "",
  });
  const [regionBeaches, setRegionBeaches] = useState<Beach[]>([]);

  // 해변명 검색
  const [beachNameQuery, setBeachNameQuery] = useState("");
  const [nameSearchResults, setNameSearchResults] = useState<Beach[]>([]);

  // 지도 다이얼로그
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const cities = getCities();

  // 해변 클릭 핸들러
  const handleBeachClick = (beach: Beach) => {
    setSelectedBeach(beach);
    setIsMapOpen(true);
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (nearestBeaches.length === 0) return;

    const data = nearestBeaches.map((beach, index) => ({
      순위: index + 1,
      해변명: beach.name,
      주소: beach.addr,
      "시/도": beach["관리처\n(시,도)"],
      "군/구": beach["관리처\n(군,구)"],
      "거리(km)": beach.distance?.toFixed(1) || "-",
      "차량 이동 시간": drivingTimes[beach.id] ? `${drivingTimes[beach.id]}분` : "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "해변 목록");
    XLSX.writeFile(wb, `해변_검색_결과_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // 주소 복사
  const handleCopyAddress = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    alert("주소가 복사되었습니다!");
  };

  // 거리 기반 차량 이동 시간 계산
  const calculateDrivingTime = (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => {
    try {
      // 거리 계산 (Haversine formula)
      const R = 6371; // 지구 반지름 (km)
      const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
      const dLon = ((destination.lng - origin.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((origin.lat * Math.PI) / 180) *
          Math.cos((destination.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // 평균 속도 50km/h로 예상 시간 계산 (일반도로 + 고속도로 혼합)
      // 거리에 따라 속도 조정 (장거리는 고속도로 이용 가정)
      const avgSpeed = distance > 50 ? 70 : distance > 20 ? 60 : 50;
      const timeInHours = distance / avgSpeed;
      const timeInMinutes = Math.round(timeInHours * 60);

      return timeInMinutes;
    } catch (error) {
      console.error("Failed to calculate driving time:", error);
    }
    return null;
  };

  // 위치 기반 검색 실행
  const handleLocationSearch = async () => {
    if (!companyAddress.trim()) return;

    setIsSearching(true);
    try {
      const results = await findNearestBeaches(companyAddress, 10);
      setNearestBeaches(results);

      // 출발지 좌표 가져오기 (Kakao Geocoding API)
      const geocodeResponse = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(companyAddress)}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        }
      );

      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.documents && geocodeData.documents.length > 0) {
          const coords = {
            lat: parseFloat(geocodeData.documents[0].y),
            lng: parseFloat(geocodeData.documents[0].x),
          };
          setCompanyCoords(coords);

          // 각 해변까지의 차량 이동 시간 계산 (병렬 처리)
          const times: Record<number, number> = {};

          // 모든 해변의 좌표 변환을 병렬로 처리
          const beachTimePromises = results.map(async (beach) => {
            try {
              // 해변 주소를 좌표로 변환
              const beachGeoResponse = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(beach.addr)}`,
                {
                  headers: {
                    Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
                  },
                }
              );

              if (beachGeoResponse.ok) {
                const beachGeoData = await beachGeoResponse.json();
                if (beachGeoData.documents && beachGeoData.documents.length > 0) {
                  const beachCoords = {
                    lat: parseFloat(beachGeoData.documents[0].y),
                    lng: parseFloat(beachGeoData.documents[0].x),
                  };

                  const time = calculateDrivingTime(coords, beachCoords);
                  if (time) {
                    return { id: beach.id, time, name: beach.name };
                  }
                }
              } else {
                console.warn(`주소 검색 실패 (${beach.name}): ${beachGeoResponse.status}`);
              }
            } catch (error) {
              console.error(`Failed to geocode ${beach.name}:`, error);
            }
            return null;
          });

          // 모든 프로미스 완료 대기
          const beachTimeResults = await Promise.all(beachTimePromises);

          // 결과를 times 객체에 저장
          beachTimeResults.forEach((result) => {
            if (result) {
              times[result.id] = result.time;
              console.log(`Beach ${result.name}: ${result.time}분`);
            }
          });

          console.log("Driving times:", times);
          setDrivingTimes(times);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // 행정구역 검색 실행
  const handleRegionSearch = () => {
    const searchRegion = {
      city: selectedRegion.city,
      district: selectedRegion.district === "all" ? "" : selectedRegion.district,
    };
    const results = filterBeachesByRegion(searchRegion);
    setRegionBeaches(results);
  };

  // 해변명 검색 실행
  const handleNameSearch = () => {
    const results = searchBeachesByName(beachNameQuery);
    setNameSearchResults(results);
  };

  // 시/도 변경 시 군/구 초기화 및 자동 검색
  const handleCityChange = (city: string) => {
    setSelectedRegion({ city, district: "" });
    // 시/도만 선택했을 때도 해당 지역의 모든 해변 표시
    const results = filterBeachesByRegion({ city, district: "" });
    setRegionBeaches(results);
  };

  // 군/구 변경 시 자동 검색
  const handleDistrictChange = (district: string) => {
    setSelectedRegion({ ...selectedRegion, district });
    const searchRegion = {
      city: selectedRegion.city,
      district: district === "all" ? "" : district,
    };
    const results = filterBeachesByRegion(searchRegion);
    setRegionBeaches(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      <div className="container mx-auto px-4 py-12 pt-24">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link href="/adopt-a-beach">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              이전페이지
            </Button>
          </Link>
        </div>
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏖️ 1분 맞춤 해변 찾기 큐레이션</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            우리 회사와 가장 가까운 해변을 찾아보세요!
            <br />
            행정구역이나 해변명으로도 검색할 수 있습니다.
          </p>
        </div>

        {/* 검색 섹션 */}
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>해변 검색 방법을 선택하세요</CardTitle>
            <CardDescription>세 가지 방법으로 원하는 해변을 찾을 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 검색 방법 선택 버튼 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Button
                variant={searchMode === "location" ? "default" : "outline"}
                className={`h-auto py-6 flex flex-col items-center gap-2 ${
                  searchMode === "location"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
                    : "bg-white hover:bg-blue-50 text-gray-700 border-2 border-gray-200"
                }`}
                onClick={() => setSearchMode("location")}
              >
                <NavigationIcon className="w-6 h-6" />
                <div className="font-bold text-base">위치 기반 검색</div>
                <div className="text-xs opacity-80 text-center leading-relaxed px-2">
                  회사 주소를 입력하면
                  <br />
                  가장 가까운 해변을 추천해드립니다.
                </div>
              </Button>
              <Button
                variant={searchMode === "region" ? "default" : "outline"}
                className={`h-auto py-6 flex flex-col items-center gap-2 ${
                  searchMode === "region"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
                    : "bg-white hover:bg-blue-50 text-gray-700 border-2 border-gray-200"
                }`}
                onClick={() => setSearchMode("region")}
              >
                <MapPin className="w-6 h-6" />
                <div className="font-bold text-base">행정구역 기반 검색</div>
                <div className="text-xs opacity-80 text-center leading-relaxed px-2">
                  원하는 지역의 일반적으로 방문하는
                  <br />
                  반려해변을 확인할 수 있습니다.
                </div>
              </Button>
              <Button
                variant={searchMode === "name" ? "default" : "outline"}
                className={`h-auto py-6 flex flex-col items-center gap-2 ${
                  searchMode === "name"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
                    : "bg-white hover:bg-blue-50 text-gray-700 border-2 border-gray-200"
                }`}
                onClick={() => setSearchMode("name")}
              >
                <List className="w-6 h-6" />
                <div className="font-bold text-base">해변명 기반 검색</div>
                <div className="text-xs opacity-80 text-center leading-relaxed px-2">
                  알고 있는 해변 이름으로
                  <br />
                  빠르게 찾을 수 있습니다.
                </div>
              </Button>
            </div>

            <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as typeof searchMode)}>
              <TabsList className="hidden">
                <TabsTrigger value="location">위치 기반</TabsTrigger>
                <TabsTrigger value="region">행정구역</TabsTrigger>
                <TabsTrigger value="name">해변명</TabsTrigger>
              </TabsList>

              {/* 위치 기반 검색 */}
              <TabsContent value="location" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="company-address" className="text-base font-semibold mb-2 block">
                    회사 주소를 입력하세요
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="company-address"
                      placeholder="예: 서울특별시 강남구 테헤란로"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleLocationSearch}
                      disabled={!companyAddress.trim() || isSearching}
                      className="px-6"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      검색
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    💡 도로명 주소나 지번 주소 모두 가능합니다
                  </p>
                </div>

                {/* 검색 결과 */}
                {nearestBeaches.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        🎯 가까운 순으로 추천 해변
                      </h3>
                      <Button
                        onClick={handleExcelDownload}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        엑셀 다운로드
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {nearestBeaches.map((beach, index) => (
                        <Card
                          key={beach.id}
                          className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleBeachClick(beach)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    {index + 1}위
                                  </span>
                                  <h4 className="text-lg font-bold text-gray-900">{beach.name}</h4>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm text-gray-600 flex-1">{beach.addr}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleCopyAddress(e, beach.addr)}
                                    className="h-7 px-2 text-xs flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" />
                                    주소복사
                                  </Button>
                                </div>
                                <div className="flex gap-2 text-xs">
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    {beach["관리처\n(시,도)"]}
                                  </span>
                                  <span className="bg-gray-100 px-2 py-1 rounded">
                                    {beach["관리처\n(군,구)"]}
                                  </span>
                                </div>
                              </div>
                              {beach.distance !== undefined && (
                                <div className="text-right ml-4">
                                  <p className="text-2xl font-bold text-blue-600">
                                    {beach.distance.toFixed(1)}
                                  </p>
                                  <p className="text-xs text-gray-500">km</p>
                                  {drivingTimes[beach.id] && (
                                    <div className="mt-2 flex items-center gap-1 justify-end">
                                      <Car className="w-3 h-3 text-gray-500" />
                                      <p className="text-sm text-gray-600">
                                        {drivingTimes[beach.id]}분
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* 행정구역 검색 */}
              <TabsContent value="region" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-base font-semibold mb-2 block">
                      시/도 선택
                    </Label>
                    <Select value={selectedRegion.city} onValueChange={handleCityChange}>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="시/도를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="district" className="text-base font-semibold mb-2 block">
                      군/구 선택
                    </Label>
                    <Select
                      value={selectedRegion.district}
                      onValueChange={handleDistrictChange}
                      disabled={!selectedRegion.city}
                    >
                      <SelectTrigger id="district">
                        <SelectValue placeholder="군/구를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {selectedRegion.city &&
                          getDistricts(selectedRegion.city).map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 검색 결과 */}
                {regionBeaches.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      📍 {selectedRegion.city}{" "}
                      {selectedRegion.district && `${selectedRegion.district} `}
                      해변 ({regionBeaches.length}개)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {regionBeaches.map((beach) => (
                        <Card
                          key={beach.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleBeachClick(beach)}
                        >
                          <CardContent className="p-4">
                            <h4 className="text-base font-bold text-gray-900 mb-1">{beach.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{beach.addr}</p>
                            <div className="flex gap-2 text-xs">
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {beach["관리처\n(시,도)"]}
                              </span>
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {beach["관리처\n(군,구)"]}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* 해변명 검색 */}
              <TabsContent value="name" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="beach-name" className="text-base font-semibold mb-2 block">
                    해변 이름을 검색하세요
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="beach-name"
                      placeholder="예: 해운대, 경포, 대천"
                      value={beachNameQuery}
                      onChange={(e) => setBeachNameQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNameSearch()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleNameSearch}
                      disabled={!beachNameQuery.trim()}
                      className="px-6"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      검색
                    </Button>
                  </div>
                </div>

                {/* 검색 결과 */}
                {nameSearchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      🔍 검색 결과 ({nameSearchResults.length}개)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {nameSearchResults.map((beach) => (
                        <Card
                          key={beach.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleBeachClick(beach)}
                        >
                          <CardContent className="p-4">
                            <h4 className="text-base font-bold text-gray-900 mb-1">{beach.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{beach.addr}</p>
                            <div className="flex gap-2 text-xs">
                              <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                                {beach["관리처\n(시,도)"]}
                              </span>
                              <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                                {beach["관리처\n(군,구)"]}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {beachNameQuery.trim() && nameSearchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 지도 다이얼로그 */}
      <BeachMapDialog beach={selectedBeach} open={isMapOpen} onOpenChange={setIsMapOpen} />
    </div>
  );
}
