"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Beach } from "@/types/beach";
import { Copy, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface BeachMapDialogProps {
  beach: Beach | null;
  open: boolean;
  onOpenChange: ((open: boolean) => void) | undefined;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function BeachMapDialog({ beach, open, onOpenChange }: BeachMapDialogProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!open || !beach) {
      return;
    }

    let isComponentMounted = true;
    let retryCount = 0;
    const maxRetries = 20;

    // 컨테이너가 준비될 때까지 기다리는 함수
    const waitForContainer = () => {
      if (!isComponentMounted) {
        return;
      }

      if (mapContainer.current) {
        initMap();
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(waitForContainer, 100);
        } else {
          console.error("지도 컨테이너를 찾을 수 없습니다.");
        }
      }
    };

    const initMap = () => {
      if (!isComponentMounted || !mapContainer.current) {
        return;
      }

      if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps API가 로드되지 않았습니다.");
        return;
      }

      // Kakao Maps load 호출
      window.kakao.maps.load(() => {
        // 지도 생성
        const container = mapContainer.current;
        if (!container) {
          console.error("지도 컨테이너를 찾을 수 없습니다.");
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치 (서울)
          level: 8,
        };

        const map = new window.kakao.maps.Map(container, options);
        mapInstance.current = map;

        // Geocoder로 주소를 좌표로 변환
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(beach.addr, (result: any[], status: any) => {
          if (!isComponentMounted) return;

          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:10px;min-width:200px;text-align:center;background:white;border-radius:8px;">
              <strong style="font-size:14px;color:#1e40af;">${beach.name}</strong><br/>
              <span style="font-size:12px;color:#666;">${beach.addr}</span>
            </div>`,
            });

            infowindow.open(map, marker);

            // 지도 중심을 결과값으로 이동
            map.setCenter(coords);
            map.setLevel(5);
          } else {
            // 주소 검색 실패 시 대략적인 위치 표시
            showApproximateLocation(map, beach);
          }
        });
      });
    };

    // 컨테이너 준비 대기 시작
    waitForContainer();

    return () => {
      isComponentMounted = false;
    };
  }, [open, beach]);

  // 대략적인 위치 표시 (주소 검색 실패 시)
  const showApproximateLocation = (map: any, beach: Beach) => {
    const regionCoords: { [key: string]: { lat: number; lng: number } } = {
      인천: { lat: 37.4563, lng: 126.7052 },
      경기: { lat: 37.4138, lng: 127.5183 },
      강원: { lat: 37.8228, lng: 128.1555 },
      충남: { lat: 36.5184, lng: 126.8 },
      전남: { lat: 34.8679, lng: 126.991 },
      전북: { lat: 35.7175, lng: 127.153 },
      경남: { lat: 35.4606, lng: 128.2132 },
      경북: { lat: 36.4919, lng: 128.8889 },
      울산: { lat: 35.5384, lng: 129.3114 },
      부산: { lat: 35.1796, lng: 129.0756 },
      제주: { lat: 33.4996, lng: 126.5312 },
    };

    const region = beach["관리처\n(시,도)"];
    const coords = regionCoords[region];

    if (coords) {
      const position = new window.kakao.maps.LatLng(coords.lat, coords.lng);
      map.setCenter(position);

      const marker = new window.kakao.maps.Marker({
        map: map,
        position: position,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:10px;text-align:center;background:white;">
          <strong>${beach.name}</strong><br/>
          <span style="font-size:12px;color:#999;">대략적인 위치</span>
        </div>`,
      });

      infowindow.open(map, marker);
    }
  };

  if (!beach) return null;

  // 해변명과 주소 복사
  const handleCopyInfo = () => {
    const info = `${beach.name}\n${beach.addr}`;
    navigator.clipboard.writeText(info);
    alert("해변명과 주소가 복사되었습니다!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {beach.name}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyInfo}
              className="h-8 px-3 text-xs flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              복사
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {beach.addr}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* 해변 정보 */}
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {beach["관리처\n(시,도)"]}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {beach["관리처\n(군,구)"]}
            </span>
          </div>

          {/* 지도 */}
          <div
            ref={mapContainer}
            className="w-full h-96 rounded-lg border-2 border-gray-300 bg-gray-50 overflow-hidden"
            style={{ minHeight: "384px" }}
          />

          <p className="text-xs text-gray-500 text-center">💡 지도는 Kakao Maps API를 사용합니다</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
