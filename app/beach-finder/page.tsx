"use client";

import { BeachMapDialog } from "@/components/BeachMapDialog";
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
import { List, MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";

export default function BeachFinderPage() {
  const [searchMode, setSearchMode] = useState<"location" | "region" | "name">("location");

  // 위치 기반 검색
  const [companyAddress, setCompanyAddress] = useState("");
  const [nearestBeaches, setNearestBeaches] = useState<BeachWithDistance[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // 위치 기반 검색 실행
  const handleLocationSearch = async () => {
    if (!companyAddress.trim()) return;

    setIsSearching(true);
    try {
      const results = await findNearestBeaches(companyAddress, 10);
      setNearestBeaches(results);
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
      <div className="container mx-auto px-4 py-12">
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
            <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as typeof searchMode)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="location" className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  위치 기반
                </TabsTrigger>
                <TabsTrigger value="region" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  행정구역
                </TabsTrigger>
                <TabsTrigger value="name" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  해변명
                </TabsTrigger>
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
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      🎯 가까운 순으로 추천 해변
                    </h3>
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
                                <p className="text-sm text-gray-600 mb-2">{beach.addr}</p>
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

        {/* 안내 메시지 */}
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 이용 안내</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>위치 기반 검색:</strong> 회사 주소를 입력하면 가장 가까운 해변을
              추천해드립니다
            </li>
            <li>
              • <strong>행정구역 검색:</strong> 원하는 지역의 모든 해변을 확인할 수 있습니다
            </li>
            <li>
              • <strong>해변명 검색:</strong> 알고 있는 해변 이름으로 빠르게 찾을 수 있습니다
            </li>
            <li>
              • <strong>해변 카드 클릭:</strong> 해변을 클릭하면 지도에서 위치를 확인할 수 있습니다
            </li>
          </ul>
        </div>
      </div>

      {/* 지도 다이얼로그 */}
      <BeachMapDialog beach={selectedBeach} open={isMapOpen} onOpenChange={setIsMapOpen} />
    </div>
  );
}
