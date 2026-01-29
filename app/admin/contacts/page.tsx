"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";

interface ContactReservation {
  id: string;
  organization: string;
  name: string;
  phone: string;
  email: string;
  method: string;
  preferred_date: string;
  preferred_time: string;
  rescheduled_date?: string;
  rescheduled_time?: string;
  rescheduled_reason?: string;
  content: string;
  created_at: string;
}

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<ContactReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactReservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"view" | "reschedule">("view");
  const [rescheduleData, setRescheduleData] = useState({
    preferred_date: "",
    preferred_time: "",
    reason: "",
  });
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [lighthouseContact, setLighthouseContact] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchContacts();
    // localStorage에서 담당자 정보 불러오기
    const savedName = localStorage.getItem("lighthouseContactName");
    const savedEmail = localStorage.getItem("lighthouseContactEmail");
    if (savedName && savedEmail) {
      setLighthouseContact({ name: savedName, email: savedEmail });
    }
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      console.log("무전 예약 데이터 가져오기 시작...");
      const { data, error } = await supabase
        .from("contact_reservations")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Supabase 응답:", { data, error });

      if (error) {
        console.error("Supabase 에러:", error);
        alert(`데이터 조회 실패: ${error.message}`);
        throw error;
      }

      console.log(`총 ${data?.length || 0}개의 무전 예약 발견`);
      setContacts(data || []);
    } catch (error) {
      console.error("무전 예약 조회 실패:", error);
      alert("무전 예약을 불러오는 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("이 무전 예약을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("contact_reservations").delete().eq("id", id);

      if (error) throw error;

      alert("삭제되었습니다.");
      fetchContacts();
      setIsModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      전화: "bg-blue-100 text-blue-800",
      이메일: "bg-green-100 text-green-800",
      화상회의: "bg-purple-100 text-purple-800",
      대면미팅: "bg-orange-100 text-orange-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const handleRowClick = (contact: ContactReservation) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    setEditMode("view");
    setRescheduleData({
      preferred_date: contact.preferred_date,
      preferred_time: contact.preferred_time,
      reason: "",
    });
  };

  const handleReschedule = () => {
    setEditMode("reschedule");
  };

  const handleSaveReschedule = async () => {
    if (!selectedContact) return;
    if (!rescheduleData.preferred_date || !rescheduleData.preferred_time) {
      alert("일정과 시간을 입력해주세요.");
      return;
    }

    try {
      // 이전 일정 저장 (이메일 발송용)
      const previousDate = selectedContact.preferred_date;
      const previousTime = selectedContact.preferred_time;

      // Supabase 업데이트 - 약속 변경 필드에 저장
      const { error } = await supabase
        .from("contact_reservations")
        .update({
          rescheduled_date: rescheduleData.preferred_date,
          rescheduled_time: rescheduleData.preferred_time,
          rescheduled_reason: rescheduleData.reason || null,
        })
        .eq("id", selectedContact.id);

      if (error) throw error;

      // 약속 변경 이메일 발송
      const emailResponse = await fetch("/api/admin/contacts/reschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: selectedContact.id,
          previousDate,
          previousTime,
          newDate: rescheduleData.preferred_date,
          newTime: rescheduleData.preferred_time,
          reason: rescheduleData.reason,
        }),
      });

      if (!emailResponse.ok) {
        console.error("이메일 발송 실패");
      }

      alert("약속이 변경되었으며, 신청자에게 변경 안내 이메일이 발송되었습니다.");
      fetchContacts();
      setEditMode("view");
      setSelectedContact({
        ...selectedContact,
        rescheduled_date: rescheduleData.preferred_date,
        rescheduled_time: rescheduleData.preferred_time,
        rescheduled_reason: rescheduleData.reason,
      });
    } catch (error) {
      console.error("약속 변경 실패:", error);
      alert("약속 변경 중 오류가 발생했습니다.");
    }
  };

  const handleCancelReschedule = () => {
    if (selectedContact) {
      setRescheduleData({
        preferred_date: selectedContact.preferred_date,
        preferred_time: selectedContact.preferred_time,
        reason: "",
      });
    }
    setEditMode("view");
  };

  const handleAccept = () => {
    setIsAcceptDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedContact) return;

    if (!lighthouseContact.name || !lighthouseContact.email) {
      alert("담당 등대지기 이름과 이메일을 입력해주세요.");
      return;
    }

    try {
      setIsSendingEmail(true);

      // localStorage에 담당자 정보 저장
      localStorage.setItem("lighthouseContactName", lighthouseContact.name);
      localStorage.setItem("lighthouseContactEmail", lighthouseContact.email);

      const response = await fetch("/api/admin/contacts/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactId: selectedContact.id,
          lighthouseContactName: lighthouseContact.name,
          lighthouseContactEmail: lighthouseContact.email,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "이메일 발송 실패");
      }

      alert("무전 예약이 수락되었으며, 신청자에게 확정 이메일이 발송되었습니다.");
      setIsAcceptDialogOpen(false);
      setIsModalOpen(false);
      fetchContacts();
    } catch (error) {
      console.error("무전 수락 실패:", error);
      alert(
        "무전 수락 처리 중 오류가 발생했습니다: " +
          (error instanceof Error ? error.message : "알 수 없는 오류")
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard']">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">무전 예약 관리</h1>
            <span className="text-sm text-gray-500">총 {contacts.length}건</span>
          </div>
          <Button onClick={fetchContacts} variant="outline" size="sm">
            새로고침
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">아직 무전 예약이 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    조직명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    담당자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    연락방법
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    희망일정
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    접수일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => handleRowClick(contact)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.organization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getMethodBadge(contact.method)}>{contact.method}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contact.rescheduled_date && contact.rescheduled_time ? (
                          <>
                            <span className="line-through text-gray-400">
                              {contact.preferred_date} {contact.preferred_time}
                            </span>
                            <br />
                            <span className="text-blue-600 font-semibold">
                              {contact.rescheduled_date} {contact.rescheduled_time}
                            </span>
                          </>
                        ) : (
                          <>
                            {contact.preferred_date} {contact.preferred_time}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(contact.created_at), "yyyy-MM-dd HH:mm", { locale: ko })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteContact(contact.id);
                        }}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 무전 예약 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto font-['Pretendard']">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editMode === "reschedule" ? "약속 변경" : "무전 예약 상세"}
            </DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4 mt-4">
              {editMode === "view" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">조직명</label>
                      <p className="mt-1 text-gray-900">{selectedContact.organization}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">담당자명</label>
                      <p className="mt-1 text-gray-900">{selectedContact.name}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">연락처</label>
                      <p className="mt-1 text-gray-900">{selectedContact.phone}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">이메일</label>
                      <p className="mt-1 text-gray-900">{selectedContact.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">선호 연락 방법</label>
                      <div className="mt-1">
                        <Badge className={getMethodBadge(selectedContact.method)}>
                          {selectedContact.method}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">희망 일정</label>
                      <p className="mt-1 text-gray-900">
                        {selectedContact.preferred_date} {selectedContact.preferred_time}
                      </p>
                    </div>
                  </div>

                  <div>
                    {selectedContact.rescheduled_date && selectedContact.rescheduled_time && (
                      <div className="pt-4 border-t border-gray-200">
                        <label className="text-sm font-semibold text-blue-700">약속 변경</label>
                        <div className="mt-1 text-gray-900">
                          <p>
                            <span className="text-gray-600">일시:</span>{" "}
                            <span className="text-blue-600 font-semibold">
                              {selectedContact.rescheduled_date} {selectedContact.rescheduled_time}
                            </span>
                          </p>
                          {selectedContact.rescheduled_reason && (
                            <p className="mt-1">
                              <span className="text-gray-600">사유:</span>{" "}
                              <span className="text-gray-800">
                                {selectedContact.rescheduled_reason}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <label className="text-sm font-semibold text-gray-700">문의 내용</label>
                    <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.content}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-semibold text-gray-700">접수 일시</label>
                    <p className="mt-1 text-gray-600">
                      {format(new Date(selectedContact.created_at), "yyyy년 MM월 dd일 HH:mm:ss", {
                        locale: ko,
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => deleteContact(selectedContact.id)}
                      variant="destructive"
                      className="font-['Pretendard']"
                    >
                      삭제
                    </Button>
                    <div className="flex-1" />
                    <Button
                      onClick={handleReschedule}
                      variant="outline"
                      className="font-['Pretendard']"
                    >
                      약속 변경
                    </Button>
                    <Button
                      onClick={handleAccept}
                      className="font-['Pretendard'] bg-blue-600 hover:bg-blue-700"
                    >
                      무전 수락
                    </Button>
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      variant="outline"
                      className="font-['Pretendard']"
                    >
                      닫기
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">변경할 일정</label>
                      <input
                        type="date"
                        value={rescheduleData.preferred_date}
                        onChange={(e) =>
                          setRescheduleData({ ...rescheduleData, preferred_date: e.target.value })
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">변경할 시간</label>
                      <select
                        value={rescheduleData.preferred_time}
                        onChange={(e) =>
                          setRescheduleData({ ...rescheduleData, preferred_time: e.target.value })
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">시간을 선택하세요</option>
                        <option value="오전 10시">오전 10시</option>
                        <option value="오전 11시">오전 11시</option>
                        <option value="오후 12시">오후 12시</option>
                        <option value="오후 1시">오후 1시</option>
                        <option value="오후 2시">오후 2시</option>
                        <option value="오후 3시">오후 3시</option>
                        <option value="오후 4시">오후 4시</option>
                        <option value="오후 5시">오후 5시</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">변경 사유</label>
                      <textarea
                        value={rescheduleData.reason}
                        onChange={(e) =>
                          setRescheduleData({ ...rescheduleData, reason: e.target.value })
                        }
                        placeholder="약속 변경 사유를 간단히 작성해주세요 (선택사항)"
                        rows={4}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveReschedule}
                      className="font-['Pretendard'] bg-blue-600 hover:bg-blue-700"
                    >
                      저장
                    </Button>
                    <Button
                      onClick={handleCancelReschedule}
                      variant="outline"
                      className="font-['Pretendard']"
                    >
                      취소
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 무전 수락 확인 다이얼로그 */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent className="max-w-md font-['Pretendard']">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">무전 예약 수락</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <p className="text-gray-700">
              정말 이 무전 예약을 수락하시겠습니까?
              <br />
              <br />
              수락 시 <strong>{selectedContact?.email}</strong>로 확정 안내 이메일이 발송됩니다.
            </p>

            {/* 담당 등대지기 정보 입력 */}
            <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-900">담당 등대지기 정보</p>
              <div>
                <label className="text-sm text-gray-700">이름 *</label>
                <input
                  type="text"
                  value={lighthouseContact.name}
                  onChange={(e) =>
                    setLighthouseContact({ ...lighthouseContact, name: e.target.value })
                  }
                  placeholder="담당자 이름 입력"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">이메일 *</label>
                <input
                  type="email"
                  value={lighthouseContact.email}
                  onChange={(e) =>
                    setLighthouseContact({ ...lighthouseContact, email: e.target.value })
                  }
                  placeholder="담당자 이메일 입력"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {selectedContact && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 font-semibold mb-2">확정 내용:</p>
                <p className="text-sm text-blue-800">
                  • 조직: {selectedContact.organization}
                  <br />• 담당자: {selectedContact.name}
                  <br />• 일정:{" "}
                  {selectedContact.rescheduled_date && selectedContact.rescheduled_time ? (
                    <>
                      <span className="line-through text-blue-400">
                        {selectedContact.preferred_date} {selectedContact.preferred_time}
                      </span>
                      {" → "}
                      <span className="font-semibold">
                        {selectedContact.rescheduled_date} {selectedContact.rescheduled_time}
                      </span>
                    </>
                  ) : (
                    <>
                      {selectedContact.preferred_date} {selectedContact.preferred_time}
                    </>
                  )}
                  <br />• 연락방법: {selectedContact.method}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleConfirmAccept}
                disabled={isSendingEmail}
                className="font-['Pretendard'] bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {isSendingEmail ? "발송 중..." : "수락 및 이메일 발송"}
              </Button>
              <Button
                onClick={() => setIsAcceptDialogOpen(false)}
                disabled={isSendingEmail}
                variant="outline"
                className="font-['Pretendard']"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
