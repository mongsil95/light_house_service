"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateWordFromTemplate } from "@/lib/documentGenerator";
import { FormData } from "@/types/easyGuide";
import { ArrowLeft, Download, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EasyGuideFormPage() {
  const [formData, setFormData] = useState<FormData>({});
  const [hasSavedData, setHasSavedData] = useState(false);

  const STORAGE_KEY = "easyGuide_form_formData";

  // 페이지 로드 시 저장된 데이터 확인
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setHasSavedData(true);
    }
  }, []);

  // 저장된 데이터 불러오기
  const loadSavedData = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setHasSavedData(false);
    }
  };

  // 임시저장
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    alert("✅ 임시저장이 완료되었습니다!");
  };

  // 임시저장 데이터 삭제
  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedData(false);
    setFormData({});
  };

  // 입력값 변경 핸들러
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // beachCount 변경 시 fundAmount 자동 계산
    if (field === "beachCount") {
      const count = parseInt(value) || 0;
      const amount = count * 3000000;
      setFormData((prev) => ({
        ...prev,
        fundAmount: `${amount.toLocaleString()}원`,
      }));
    }

    // grassrootsCount 변경 시 grassrootsAmount 자동 계산
    if (field === "grassrootsCount") {
      const count = parseInt(value) || 0;
      const amount = count * 1500000;
      setFormData((prev) => ({
        ...prev,
        grassrootsAmount: `${count}개 단체 × 150만원 = 일금${amount.toLocaleString()}원`,
      }));
    }
  };

  // Word 다운로드
  const handleDownloadWord = async () => {
    try {
      // 필수 필드 검증
      const requiredFields = [
        "organizationName",
        "organizationType",
        "registrationNumber",
        "representativeName",
        "managerName",
        "officePhone",
        "mobilePhone",
        "email",
        "address",
        "beachCount",
        "beachLocation",
        "beachAdminDistrict",
        "paymentMethod",
        "paymentDate",
        "activityPeriod",
        "safetyInsurance",
        "consent",
      ];

      const missingFields = requiredFields.filter((field) => !formData[field as keyof FormData]);

      if (missingFields.length > 0) {
        alert(
          "다음 필수 항목을 입력해주세요:\n" +
            missingFields.map((f) => fieldLabels[f as keyof typeof fieldLabels] || f).join(", ")
        );
        return;
      }

      // 동의 날짜 자동 설정
      const today = new Date();
      const consentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const currentDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

      const finalFormData = {
        ...formData,
        consentDate,
        currentDate,
      };

      await generateWordFromTemplate(finalFormData);
      alert("✅ Word 문서가 다운로드되었습니다!");
    } catch (error) {
      console.error("Word 생성 오류:", error);
      alert("❌ 문서 생성 중 오류가 발생했습니다.");
    }
  };

  // 필드 레이블 매핑
  const fieldLabels = {
    organizationName: "기관명",
    organizationType: "단체 형태",
    registrationNumber: "사업자등록번호",
    representativeName: "대표자명",
    managerName: "담당자명",
    officePhone: "직통내선",
    mobilePhone: "핸드폰번호",
    email: "이메일",
    address: "주소",
    beachCount: "입양 해변 개수",
    beachLocation: "해변 위치",
    beachAdminDistrict: "해변 행정구역",
    grassrootsSupport: "풀뿌리 환경단체 지원여부",
    grassrootsCount: "풀뿌리 환경단체 지원개수",
    paymentMethod: "기부금 집행 방식",
    paymentMethodDetail: "기부금 집행 방식 상세",
    paymentDate: "기부금 납입 예정일",
    activityPeriod: "예상 활동 계획",
    safetyInsurance: "보험 가입 여부",
    safetyMeasure: "안전사고 대비 방안",
    consent: "개인정보 수집 및 이용 동의",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* 뒤로가기 버튼 */}
        <Link href="/easy-guide">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            다른 방식 선택하기
          </Button>
        </Link>

        <div className="relative flex gap-6">
          {/* 메인 폼 영역 */}
          <div className="flex-1 max-w-4xl">
            <Card className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">반려해변 입양 신청서</h1>
                <p className="text-gray-600">
                  아래 양식을 작성하시면 Word 문서로 다운로드하실 수 있습니다.
                </p>
              </div>

              <form className="space-y-8">
                {/* 1. 기관 정보 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2">1. 기관 정보</h2>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      기관명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="organizationName"
                      placeholder="예: 해말은사회적기업"
                      value={formData.organizationName || ""}
                      onChange={(e) => handleChange("organizationName", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                    <p className="text-sm text-gray-500">
                      사업자등록증(단체 등록증)에 명시되어 있는 기관명을 작성해주세요.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">
                      단체 형태 <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="organizationType"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.organizationType || ""}
                      onChange={(e) => handleChange("organizationType", e.target.value)}
                    >
                      <option value="">선택해주세요</option>
                      <option value="대기업">대기업</option>
                      <option value="중견기업">중견기업</option>
                      <option value="중소기업">중소기업</option>
                      <option value="스타트업/창업기업">스타트업/창업기업</option>
                      <option value="비영리법인/단체">비영리법인/단체</option>
                      <option value="교육기관">교육기관</option>
                      <option value="공기업/준정부기관/출연기관/공공기관">
                        공기업/준정부기관/출연기관/공공기관
                      </option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">
                      사업자등록번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="registrationNumber"
                      placeholder="예: 123-45-67890"
                      value={formData.registrationNumber || ""}
                      onChange={(e) => handleChange("registrationNumber", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="representativeName">
                      대표자명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="representativeName"
                      placeholder="예: 홍길동"
                      value={formData.representativeName || ""}
                      onChange={(e) => handleChange("representativeName", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managerName">
                      담당자명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="managerName"
                      placeholder="예: 김철수"
                      value={formData.managerName || ""}
                      onChange={(e) => handleChange("managerName", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officePhone">
                      담당자 직통내선 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="officePhone"
                      placeholder="예: 02-1234-1234"
                      value={formData.officePhone || ""}
                      onChange={(e) => handleChange("officePhone", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                    <p className="text-sm text-gray-500">
                      사무실 전화번호 또는 직통내선 번호를 알려주세요.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobilePhone">
                      담당자 핸드폰번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobilePhone"
                      placeholder="예: 010-1234-1234"
                      value={formData.mobilePhone || ""}
                      onChange={(e) => handleChange("mobilePhone", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      이메일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="예: example@email.com"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      주소 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="예: 서울특별시 종로구 세종대로 209"
                      value={formData.address || ""}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>
                </section>

                {/* 2. 입양 신청 정보 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                    2. 입양 신청 정보
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="beachCount">
                      입양할 해변 개수 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="beachCount"
                      type="number"
                      min="1"
                      placeholder="예: 1"
                      value={formData.beachCount || ""}
                      onChange={(e) => handleChange("beachCount", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                    <p className="text-sm text-gray-500">해변 1개당 300만원의 기금이 필요합니다.</p>
                    {formData.fundAmount && (
                      <p className="text-sm font-semibold text-blue-600">
                        입양 기금: {formData.fundAmount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beachLocation">
                      입양 희망 해변 위치 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="beachLocation"
                      placeholder="예: 해운대 해수욕장"
                      value={formData.beachLocation || ""}
                      onChange={(e) => handleChange("beachLocation", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beachAdminDistrict">
                      해변 행정구역 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="beachAdminDistrict"
                      placeholder="예: 부산광역시 해운대구"
                      value={formData.beachAdminDistrict || ""}
                      onChange={(e) => handleChange("beachAdminDistrict", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityPeriod">
                      예상 활동 계획 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="activityPeriod"
                      placeholder="예: 매월 셋째주 화요일 해변정화, 4월 1회차 활동 및 9월 2회차 활동 예정"
                      value={formData.activityPeriod || ""}
                      onChange={(e) => handleChange("activityPeriod", e.target.value)}
                      rows={3}
                      className="placeholder:text-gray-400"
                    />
                  </div>
                </section>

                {/* 3. 풀뿌리 환경단체 지원 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                    3. 풀뿌리 환경단체 지원
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="grassrootsSupport">풀뿌리 환경단체 지원여부</Label>
                    <select
                      id="grassrootsSupport"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.grassrootsSupport || ""}
                      onChange={(e) => handleChange("grassrootsSupport", e.target.value)}
                    >
                      <option value="">선택해주세요</option>
                      <option value="예">예</option>
                      <option value="아니오">아니오</option>
                    </select>
                    <p className="text-sm text-gray-500">
                      1개의 풀뿌리 환경단체 당 150만원 지원을 약속합니다.
                    </p>
                  </div>

                  {formData.grassrootsSupport === "예" && (
                    <div className="space-y-2">
                      <Label htmlFor="grassrootsCount">풀뿌리 환경단체 지원개수</Label>
                      <Input
                        id="grassrootsCount"
                        type="number"
                        min="1"
                        placeholder="예: 1"
                        value={formData.grassrootsCount || ""}
                        onChange={(e) => handleChange("grassrootsCount", e.target.value)}
                        className="placeholder:text-gray-400"
                      />
                      {formData.grassrootsAmount && (
                        <p className="text-sm font-semibold text-green-600">
                          지원 금액: {formData.grassrootsAmount}
                        </p>
                      )}
                    </div>
                  )}
                </section>

                {/* 4. 기부금 정보 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2">4. 기부금 정보</h2>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">
                      기부금 집행 방식 <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="paymentMethod"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.paymentMethod || ""}
                      onChange={(e) => handleChange("paymentMethod", e.target.value)}
                    >
                      <option value="">선택해주세요</option>
                      <option value="계좌 이체">계좌 이체</option>
                      <option value="카드 결제">카드 결제</option>
                      <option value="그 외">그 외</option>
                    </select>
                  </div>

                  {formData.paymentMethod === "그 외" && (
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethodDetail">기부금 집행 방식 상세</Label>
                      <Input
                        id="paymentMethodDetail"
                        placeholder="예: 현금, 물품 지원 등"
                        value={formData.paymentMethodDetail || ""}
                        onChange={(e) => handleChange("paymentMethodDetail", e.target.value)}
                        className="placeholder:text-gray-400"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">
                      기부금 납입 예정일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate || ""}
                      onChange={(e) => handleChange("paymentDate", e.target.value)}
                      className="placeholder:text-gray-400"
                    />
                  </div>
                </section>

                {/* 5. 안전 관리 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2">5. 안전 관리</h2>

                  <div className="space-y-2">
                    <Label htmlFor="safetyInsurance">
                      단체상해보험 가입 여부 <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="safetyInsurance"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.safetyInsurance || ""}
                      onChange={(e) => handleChange("safetyInsurance", e.target.value)}
                    >
                      <option value="">선택해주세요</option>
                      <option value="예">예</option>
                      <option value="아니오">아니오</option>
                      <option value="가입 예정">가입 예정</option>
                    </select>
                    <p className="text-sm text-gray-500">
                      반려해변 활동 중 발생하는 사고에 대한 책임은 입양기관에게 있습니다.
                    </p>
                  </div>

                  {formData.safetyInsurance === "아니오" && (
                    <div className="space-y-2">
                      <Label htmlFor="safetyMeasure">안전사고 대비 방안</Label>
                      <Textarea
                        id="safetyMeasure"
                        placeholder="예: 별도 여행보험 가입 진행"
                        value={formData.safetyMeasure || ""}
                        onChange={(e) => handleChange("safetyMeasure", e.target.value)}
                        rows={2}
                        className="placeholder:text-gray-400"
                      />
                    </div>
                  )}
                </section>

                {/* 6. 개인정보 동의 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                    6. 개인정보 동의
                  </h2>

                  <div className="space-y-2">
                    <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                      <p className="font-semibold mb-2">개인정보 수집 및 이용 안내</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>수집 항목: 기관명, 대표자명, 담당자명, 연락처, 이메일, 주소</li>
                        <li>수집 목적: 해변 입양 프로그램 운영 및 관리</li>
                        <li>보유 기간: 수집일로부터 3년</li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={formData.consent === "동의합니다"}
                        onChange={(e) =>
                          handleChange("consent", e.target.checked ? "동의합니다" : "")
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="consent">
                        개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                      </Label>
                    </div>
                  </div>
                </section>
              </form>
            </Card>
          </div>

          {/* 오른쪽 플로팅 버튼 */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-3 w-48">
              {hasSavedData && (
                <Button
                  onClick={loadSavedData}
                  variant="outline"
                  className="w-full bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  불러오기
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                className="w-full bg-white hover:bg-gray-50"
              >
                <Save className="h-4 w-4 mr-2" />
                임시저장
              </Button>
              <Button
                type="button"
                onClick={handleDownloadWord}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Word 다운로드
              </Button>
            </div>
          </div>

          {/* 모바일 하단 버튼 */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="flex gap-2 max-w-4xl mx-auto">
              {hasSavedData && (
                <Button
                  onClick={loadSavedData}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-300 text-green-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  불러오기
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                size="sm"
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-1" />
                임시저장
              </Button>
              <Button
                type="button"
                onClick={handleDownloadWord}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Word
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
