import { formatSmartDate } from '@/lib/utils/dateUtils';
import { Html, Section, Heading, Text, Img } from '@react-email/components';

export function LitterPlacementNotifyOfficeWithPlace({
  groupName,
  municipalManagerName,
  municipalGroupName,
  municipalManagerEmail,
  municipalManagerPhone,
  municipalManagerTel,
  beachName,
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
  activityLink
}: any) {
  // 카카오맵링크 생성
  const officialKakaoLink = (pileLat && pileLng)
    ? `https://map.kakao.com/link/map/공식적치장,${pileLat},${pileLng}`
    : null;
  const dumpedKakaoLink = (dumpedLat && dumpedLng)
    ? `https://map.kakao.com/link/map/실적치장소,${dumpedLat},${dumpedLng}`
    : null;

  return (
    <Html>
      <Section style={{
        padding: '24px',
        fontFamily: 'sans-serif',
        background: '#f9fafb',
        color: '#1f2937',
        borderRadius: '8px'
      }}>
        <Heading style={{
          fontSize: '20px',
          color: '#333',
          marginBottom: '12px',
          fontWeight: 'bold'
        }}>
          [사무국 공유]해양폐기물 적치 신고
        </Heading>
        <Text style={{ marginBottom: '10px', color: '#0e7490' }}>
          아래의 지정장소 해변정화 적치 신고가 <b>지자체에 공식 전달</b> 및 사무국에 접수되었습니다.
          지자체 확인 및 연락이 필요할 수 있습니다.
        </Text>
        <Section style={{
          background: '#fff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '14px'
        }}>
          <Text><b>활동명:</b> {activityTitle || '이름 없음'}</Text>
          <Text><b>정화기관:</b> {groupName || '이름 없음'}</Text>
          <Text><b>활동일시:</b> {formatSmartDate(startDate).date} {formatSmartDate(startDate).time} ~ {formatSmartDate(endDate).date} {formatSmartDate(endDate).time} </Text>
          <Text><b>해변:</b> {beachName}</Text>
          <Text>
            <b>공식 적치 장소:</b>{' '}
            {pileLat && officialKakaoLink
              ? <a href={officialKakaoLink} target="_blank" style={{ color: '#0984e3' }}>카카오맵 바로가기 ({pileLat}, {pileLng})</a>
              : '-'}
          </Text>
          <Text>
            <b>실제 적치 위치(GPS):</b>{' '}
            {dumpedKakaoLink
              ? <a href={dumpedKakaoLink} target="_blank" style={{ color: '#10b981' }}>카카오맵 바로가기 ({dumpedLat}, {dumpedLng})</a>
              : '-'}
          </Text>
          <Text style={{ marginTop: '12px', fontSize: '13px', color: '#ff4c4c' }}>
            ※ 실제 적치 위치 기록은 부정확할 수 있습니다. 사진과 함께 참고 부탁드립니다.
          </Text>


          <Text style={{ fontSize: '16px', marginBottom: '8px' }}>담당자 정보</Text>
          <Text><b>지자체:</b> {municipalGroupName || '이름 없음'}</Text>
          <Text><b>담당자:</b> {municipalManagerName || '이름 없음'}</Text>
          <Text><b>이메일:</b> {municipalManagerEmail || '이메일 없음'}</Text>
          <Text><b>내선:</b> {municipalManagerTel || '내선 없음'}</Text>
          <Text><b>모바일:</b> {municipalManagerPhone || '없음'}</Text>
        </Section>


        <Section style={{ marginTop: '18px', marginBottom: '10px' }}>
          <Heading style={{ fontSize: '16px', marginBottom: '8px', color: '#333' }}>
            사진 링크
          </Heading>
          <ul style={{ margin: 0, padding: 0 }}>
            {photos.map((url: string, idx: number) => (
              <li key={idx} style={{ listStyle: 'none', marginBottom: '4px' }}>
                <a
                  href={url}
                  style={{ color: '#585858', textDecoration: 'underline' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  적치사진{idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </Section>


        {comment && (
          <Text style={{ color: '#0e7490', marginTop: '8px' }}>
            <b>추가 메모:</b> {comment}
          </Text>
        )}
        {activityLink && (
          <Section style={{ marginTop: '18px', textAlign: 'center' }}>
            <a
              href={activityLink}
              style={{
                display: 'inline-block',
                background: '#0ea5e9',
                color: '#fff',
                padding: '10px 22px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none'
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              모임페이지에서 확인하기
            </a>
          </Section>
        )}
      </Section>
    </Html>
  );
}
