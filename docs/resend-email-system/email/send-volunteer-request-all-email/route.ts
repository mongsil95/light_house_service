// src/app/api/send-volunteer-invites/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const members = body.members; // 배열로 받음

  for (const member of members) {
    // const token = generateInviteToken(member); // 자체 토큰 생성 함수
    // const link = `https://team.caresea.kr/volunteer/register?token=${token}`;

    // await sendVolunteerEmail({
    //   name: member.truename,
    //   group_name: member.group_name,
    //   email: member.useremail,
    //   // link,
    // });
  }

  return NextResponse.json({ status: 'ok', count: members.length });
}
