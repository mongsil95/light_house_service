import {
  Html,
  Section,
  Heading,
  Text,
  Img,
  Row,
  Column,
} from '@react-email/components';

interface Props {
  data: {
    username: string;
    accountId: string;
    password: string;
    useremail: string;
    team: string;
  };
}

export function SupporterSignupEmail({ data }: Props) {
  return (
    <Html>
      <Section
        style={{
          padding: '24px',
          fontFamily: 'sans-serif',
          backgroundColor: '#f9fafb',
          color: '#1f2937',
        }}
      >
        <Img
          src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fadb_logo.png&w=3840&q=75"
          alt="반려해변 로고"
          width="120"
          style={{ marginBottom: '24px' }}
        />

        <Heading
          style={{
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#00298a',
          }}
        >
          반려해변 서포터즈 등록이 완료되었습니다
        </Heading>

        <Text
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px',
            color: '#2c2c2c',
          }}
        >
          <strong>{data.username}</strong>님, 반려해변 공식 서포터즈 등록을 진심으로 환영합니다!<br />
          해당 계정은 <strong>이타시티(ita.city)</strong> 플랫폼과 <strong>반려해변 서포터즈 활동 페이지</strong> 모두에서 사용됩니다.
        </Text>

        <Section style={{ borderTop: '1px dashed #d1d5db', margin: '24px 0' }} />

        <Text
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000000',
          }}
        >
          계정 정보
        </Text>

        <Text style={{ fontSize: '14px', marginBottom: '3px' }}>
          아이디: {data.accountId}
        </Text>
        <Text style={{ fontSize: '14px', marginBottom: '3px' }}>
          닉네임: {data.username}
        </Text>
        <Text style={{ fontSize: '14px', marginBottom: '3px' }}>
          비밀번호: {data.password}
        </Text>
        <Text style={{ fontSize: '14px', marginBottom: '3px' }}>
          이메일: {data.useremail}
        </Text>
        {/* <Text style={{ fontSize: '14px', marginBottom: '16px' }}>
          소속 팀: {data.team}
        </Text> */}

        <Section style={{ borderTop: '1px dashed #d1d5db', margin: '24px 0' }} />

        <Text style={{ fontSize: '14px', lineHeight: '1.6', color: '#2c2c2c' }}>
          반려해변 서포터즈 활동 페이지는 <strong>5월 28일 전후</strong> 오픈될 예정입니다.<br />
          자세한 활동 가이드는 추후 이메일과 채널을 통해 안내드리겠습니다.
        </Text>

        <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '24px', color: '#2c2c2c' }}>
          이타서울 | 반려해변 운영팀 드림
        </Text>

        <Section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a
            href="https://ita.city"
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
            이타시티 에서 쓰레기 줍기
          </a>
        </Section>

        <Section style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <Row>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fgov_logo.png&w=3840&q=75"
                alt="해양수산부"
                width="80"
              />
            </Column>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fkoem_logo.png&w=3840&q=75"
                alt="해양환경공단"
                width="80"
              />
            </Column>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fitaseoul_logo.png&w=3840&q=75"
                alt="이타서울"
                width="80"
              />
            </Column>
          </Row>
        </Section>

        <Text
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '24px',
            lineHeight: '1.5',
            borderTop: '1px dashed #d1d5db',
            paddingTop: '16px',
          }}
        >
          ※ 본 이메일은 반려해변 서포터즈 가입 확인을 위해 발송되었습니다. <br />
          ※ 문의: itaseoul@itaseoul.org |{' '}
          <a
            href="https://pf.kakao.com/_irYGC"
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            반려해변 카카오채널
          </a>
        </Text>
      </Section>
    </Html>
  );
}
