import { formatSmartDate } from "@/lib/utils/dateUtils";
import {
  Html,
  Section,
  Heading,
  Text,
  Img,
  Row,
  Column,
} from "@react-email/components";

export function LitterPlacementNotifyMunicipality({
  beachName,
  managerEmail,
  managerPhone,
  managerTel,
  managerName,
  groupName,
  activityTitle,
  startDate,
  endDate,
  pileAddr,
  pileLat,
  pileLng,
  dumpedLat,
  dumpedLng,
  photos,
  comment,
  municipalManagerName,
  municipalGroupName,
  activityLink,
}: any) {
  // 카카오맵 링크 생성
  const officialKakaoLink =
    pileLat && pileLng
      ? `https://map.kakao.com/link/map/공식적치장,${pileLat},${pileLng}`
      : null;
  const dumpedKakaoLink =
    dumpedLat && dumpedLng
      ? `https://map.kakao.com/link/map/실적치장소,${dumpedLat},${dumpedLng}`
      : null;

  return (
    <Html>
      <Section
        style={{
          padding: "24px",
          fontFamily: "sans-serif",
          background: "#f9fafb",
          color: "#1f2937",
          borderRadius: "8px",
        }}
      >
        <Row>
          <Column align="left">
            <Img
              src="https://team.caresea.kr/logo/adb_logo.png"
              alt="반려해변 로고"
              width="110"
              style={{ marginBottom: "12px" }}
            />
          </Column>
        </Row>
        <Heading
          style={{
            fontSize: "20px",
            color: "#333",
            marginBottom: "12px",
            fontWeight: "bold",
          }}
        >
          [반려해변] {beachName} 수거폐기물 적치를 보고드립니다.
        </Heading>
        <Text
          style={{
            fontSize: "16px",
            marginBottom: "10px",
            color: "#333",
            lineHeight: 1.7,
          }}
        >
          안녕하세요,{" "}
          {municipalManagerName
            ? `${municipalManagerName} 담당자님`
            : "담당자님"}
          .
          <br />
          {municipalGroupName ? <b>{municipalGroupName}</b> : null}의 해양환경
          보호의 협력과 노고에 깊이 감사드립니다.
          <br />이 신고는 민원 접수가 아닌,{" "}
          <b>
            반려해변 협력 지자체 간의 원활한 수거 및 행정협력을 위한 공식 안내
          </b>
          입니다.
          <br />
          아래 폐기물 적치신고와 수거과정의 행정 협력 요청 사항을 확인
          부탁드립니다.
          <br />
        </Text>

        {/* 보고서  */}
        <Text
          style={{
            fontSize: "18px",
            marginBottom: "10px",
            color: "#0984e3",
            fontWeight: "bold",
          }}
        >
          ■ {beachName} 정화 및 수거폐기물 적치 보고서
        </Text>
        <Section
          style={{
            background: "#ffffff",
            border: "1px solid #bae6fd",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0, 125, 180, 0.15)",
            padding: "16px",
            marginBottom: "18px",
          }}
        >
          <Text>
            <b>해변명:</b> {beachName}
          </Text>
          <Text>
            <b>활동명:</b> {activityTitle}
          </Text>
          {/* 활동일시 */}
          <Text>
            <b>활동일시:</b>
            <br />
            시작: {formatSmartDate(startDate).date}{" "}
            {formatSmartDate(startDate).time}
            <br />
            종료: {formatSmartDate(endDate).date}{" "}
            {formatSmartDate(endDate).time}
          </Text>
          <Text>
            <b>정화기관:</b> {groupName}
          </Text>
          <Text>
            <b>담당자:</b> {managerName} {managerEmail} {managerTel}
          </Text>
          <Text>
            <b>공식 적치 장소:</b>{" "}
            {pileLat && officialKakaoLink ? (
              <a
                href={officialKakaoLink}
                target="_blank"
                style={{ color: "#0984e3" }}
              >
                카카오맵 바로가기 ({pileLat}, {pileLng})
              </a>
            ) : (
              "-"
            )}
          </Text>
          <Text>
            <b>실제 적치 위치(GPS):</b>{" "}
            {dumpedKakaoLink ? (
              <a
                href={dumpedKakaoLink}
                target="_blank"
                style={{ color: "#0984e3" }}
              >
                카카오맵 바로가기 ({dumpedLat}, {dumpedLng})
              </a>
            ) : (
              "-"
            )}
          </Text>

          <Text
            style={{ marginTop: "12px", fontSize: "13px", color: "#ff4c4c" }}
          >
            ※ 실제 적치 위치 기록은 부정확할 수 있습니다. 사진과 함께 참고
            부탁드립니다.
          </Text>

          {comment ? (
            <Text>
              <b>참고:</b> {comment}
            </Text>
          ) : null}
        </Section>

        <Section style={{ marginTop: "18px", marginBottom: "10px" }}>
          <Heading
            style={{ fontSize: "16px", marginBottom: "8px", color: "#0984e3" }}
          >
            사진 링크
          </Heading>
          <ul style={{ margin: 0, padding: 0 }}>
            {photos.map((url: string, idx: number) => (
              <li key={idx} style={{ listStyle: "none", marginBottom: "4px" }}>
                <a
                  href={url}
                  style={{ color: "#0984e3", textDecoration: "underline" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  적치사진{idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {/* 계정 바로가기  */}
        <Section style={{ marginTop: "18px", marginBottom: "10px" }}>
          <a
            href={activityLink}
            style={{
              display: "inline-block",
              backgroundColor: "#0984e3",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            관리 페이지 바로가기
          </a>
        </Section>

        <Section
          style={{
            marginTop: "22px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          <Text>
            수거와 처리 과정에 함께 힘써주심에 다시 한 번 깊이 감사드리며
            <br />
            지역 환경 보전과 행정협력에 앞으로도 변함없는 지원 부탁드립니다.
            <br />
          </Text>
          <Text
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#666",
            }}
          >
            ※ 본 안내는 반려해변 공식 행정협력을 위한 것으로, 민원건의 접수가
            아님을 다시 한 번 안내드립니다.
          </Text>
        </Section>

        <Section style={{ borderTop: "1px solid #bae6fd", paddingTop: "18px" }}>
          <Row>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/logo/adb_logo.png"
                alt="반려해변 로고"
                width="85"
              />
            </Column>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/logo/koem_logo.png"
                alt="해양환경공단 로고"
                width="100"
              />
            </Column>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/logo/itaseoul_logo.png"
                alt="이타서울 로고"
                width="70"
              />
            </Column>
          </Row>
        </Section>
        <Text
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "24px",
            lineHeight: "1.5",
          }}
        >
          문의: 이타서울, 반려해변 사무국 | itaseoul@itaseoul.org <br />
          추가 문의사항은 이메일 또는 아래 번호로 연락주세요
          <br />
          <a href="tel:070-8015-4141">070-8015-4141</a>
          *(오전10시 - 오후5시) 주중 문의
        </Text>
      </Section>
    </Html>
  );
}
