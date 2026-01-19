"use client";

import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Mail, Phone, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  showContact?: boolean; // 연락처 표시 여부
}

interface ChatSession {
  messages: Message[];
  savedAt: number; // 타임스탬프
}

const CHAT_STORAGE_KEY = "lighthouse_chat_session";
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2시간 (밀리초)

export default function InquiryPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 등대AI기 입니다. 🌊 \n\n무엇을 도와드릴까요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 localStorage에서 대화 내용 불러오기
  useEffect(() => {
    const loadChatSession = () => {
      try {
        const savedSession = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedSession) {
          const session: ChatSession = JSON.parse(savedSession);
          const now = Date.now();
          const timeDiff = now - session.savedAt;

          // 2시간 이내의 세션이면 복원
          if (timeDiff < SESSION_DURATION) {
            const restoredMessages = session.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(restoredMessages);
          } else {
            // 2시간이 지났으면 localStorage 삭제
            localStorage.removeItem(CHAT_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Failed to load chat session:", error);
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    };

    loadChatSession();
  }, []);

  // 메시지 변경 시 localStorage에 저장
  useEffect(() => {
    if (messages.length > 1) {
      // 초기 메시지만 있는 경우 제외
      try {
        const session: ChatSession = {
          messages: messages,
          savedAt: Date.now(),
        };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        console.error("Failed to save chat session:", error);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const currentInput = inputMessage;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: messages.length + 1,
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // GPT API 호출
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.slice(-10), // 최근 10개 메시지만 전송
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
        showContact: data.showContact || false,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage: Message = {
        id: messages.length + 2,
        text: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😥\n\n문제가 계속되면 사무국으로 문의해주세요.",
        sender: "bot",
        timestamp: new Date(),
        showContact: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl text-blue-900 mb-4 font-[Cafe24_Ssurround]">
              등대AI기와 대화하기
            </h1>
            <p className="text-lg text-gray-700 font-[Cafe24_Ssurround]">
              궁금한 점을 물어보세요. 24시간 답변드립니다! 🤖
            </p>
          </div>

          <Card className="border-2 border-blue-200 shadow-xl">
            <CardContent className="p-0">
              {/* 챗 메시지 영역 */}
              <div className="h-[600px] flex flex-col">
                {/* 메시지 리스트 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* 아바타 */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-blue-500"
                            : "bg-gradient-to-br from-blue-400 to-blue-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-6 h-6 text-white" />
                        ) : (
                          <Bot className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* 메시지 버블 */}
                      <div className="flex flex-col gap-2 max-w-[70%]">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="font-[Cafe24_Ssurround] whitespace-pre-line">
                            {message.text}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user" ? "text-blue-100" : "text-gray-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* 연락처 카드 (FAQ에 없는 경우만 표시) */}
                        {message.showContact && message.sender === "bot" && (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 space-y-3">
                            <h4 className="font-[Cafe24_Ssurround] text-blue-900 text-sm">
                              📞 사무국 연락처
                            </h4>
                            <div className="space-y-2">
                              <a
                                href="tel:070-8015-4120"
                                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                                <span className="font-[Cafe24_Ssurround]">070-8015-4120</span>
                              </a>
                              <a
                                href="mailto:itaseoul@naver.com"
                                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                                <span className="font-[Cafe24_Ssurround]">itaseoul@naver.com</span>
                              </a>
                            </div>
                            <p className="text-xs text-blue-600 font-[Cafe24_Ssurround]">
                              평일 09:30 - 17:00 (주말 및 공휴일 제외)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* 타이핑 인디케이터 */}
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-300 text-white rounded-lg transition-colors flex items-center gap-2 font-[Cafe24_Ssurround]"
                    >
                      <Send className="w-5 h-5" />
                      전송
                    </button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 질문 버튼 */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "반려해변이 무엇인가요?",
              "해봄 활동 참여 방법은?",
              "운영시간이 어떻게 되나요?",
              "연락처가 궁금해요",
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputMessage(question);
                  const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                  setTimeout(() => handleSendMessage(fakeEvent), 100);
                }}
                className="px-4 py-2 bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all text-sm font-[Cafe24_Ssurround] text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
