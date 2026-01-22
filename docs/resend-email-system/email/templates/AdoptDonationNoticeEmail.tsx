import {
  Html,
  Section,
  Heading,
  Text,
  Img,
} from '@react-email/components';

export function AdoptDonationNoticeEmail({ data }: { data: any }) {
  return (
    <Html>
      <Section style={{
        padding: '24px',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9fafb',
        color: '#1f2937',
      }}>
        <Img
          src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fadb_logo.png&w=3840&q=75"
          alt="반려해변 로고"
          width="120"
          style={{ marginBottom: '24px' }}
        />

        <Heading style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#00298a',
        }}>
          [확인 요청] 반려해변 운영 기금 참여 의향 안내
        </Heading>

        <Text style={{
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '16px',
          color: '#2c2c2c',
        }}>
          안녕하세요, <strong>{data.managerName}</strong> 담당자님.<br /><br />
          이번 반려해변 정식 입양 공모에 관심을 가져주시고 신청해주셔서 진심으로 감사드립니다.<br />
          모든 신청서는 잘 접수되었으며, 향후 심사를 통해 최종 선정 절차가 진행될 예정입니다.
        </Text>

        <Text style={{
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '16px',
          color: '#2c2c2c',
        }}>
          이에 따라, <strong>반려해변 운영을 위한 기금 참여 의향</strong>을 간단히 확인드리고자 합니다.<br /><br />
          🌿 본 기부는 <strong>자율적으로 참여</strong>하실 수 있으며, 기관당 약 <strong>300만 원 내외</strong>의 가변 비용이 발생할 수 있습니다.<br />
          이는 해변 현장 운영, 참여 키트 제작, 홍보물 제작 등에 활용될 예정입니다.<br /><br />
          <strong>기부 참여 여부는 입양 심사 시 가점 요소</strong>로 반영될 수 있으며,<br />
          운영 의지가 높은 기관을 우선 선정하는 데 참고 자료로 활용됩니다.
        </Text>

        <Text style={{
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '24px',
          color: '#2c2c2c',
        }}>
          아래 링크를 통해 <strong>기부 참여 의향서를 작성</strong>해주시기 바랍니다.<br />
          (※ 실제 기부금 납부는 선정 이후 별도 안내 예정입니다.)
        </Text>

        <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a
            href="https://caresea.kr/donation-intent"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            기부 참여 의향서 작성하기
          </a>
        </Section>

        <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#2c2c2c' }}>
          <strong>문의처</strong><br />
          운영·정화 문의: 010-5534-4194<br />
          시스템 문의: 02-3498-8588 (이타서울 사무국)
        </Text>

        <Text style={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginTop: '32px',
          color: '#2c2c2c',
        }}>
          반려해변 사무국 드림<br />
          이문구 올림
        </Text>
      </Section>
    </Html>
  );
}
