import React, { useMemo, useRef, useState, useEffect } from "react";

/**
 * ChatPage (full page) — giống bố cục app Chatbox trong video:
 * - Sidebar danh sách chat
 * - Khung chat bên phải
 * - Lưu localStorage
 */

const LS_KEY = "chatbox_conversations_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function loadConversations() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveConversations(convs) {
  localStorage.setItem(LS_KEY, JSON.stringify(convs));
}

function makeNewConversation() {
  const id = uid();
  return {
    id,
    title: "Cuộc trò chuyện mới",
    createdAt: Date.now(),
    messages: [
      {
        id: uid(),
        role: "assistant",
        content: "Xin chào! Đây là Chatbox (demo). Bạn cần hỗ trợ gì?",
        at: Date.now(),
      },
    ],
  };
}

function botReply(userText) {
  const t = (userText || "").trim();
  if (!t) return "Bạn gửi mình câu hỏi nhé 🙂";
  return `Mình đã nhận: "${t}". (Demo)`;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState(() => loadConversations());
  const [activeId, setActiveId] = useState(() => loadConversations()[0]?.id || null);
  const [text, setText] = useState("");

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);
  const listRef = useRef(null);

  useEffect(() => {
    if (conversations.length === 0) {
      const first = makeNewConversation();
      setConversations([first]);
      setActiveId(first.id);
      saveConversations([first]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [active?.messages?.length]);

  function onNewChat() {
    const c = makeNewConversation();
    const next = [c, ...conversations];
    setConversations(next);
    setActiveId(c.id);
  }

  function onDeleteChat(id) {
    const next = conversations.filter((c) => c.id !== id);
    setConversations(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
  }

  function onSend(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !active) return;

    const userMsg = { id: uid(), role: "user", content: t, at: Date.now() };
    const assistantMsg = { id: uid(), role: "assistant", content: botReply(t), at: Date.now() };

    const newTitle =
      active.title === "Cuộc trò chuyện mới" ? (t.length > 22 ? t.slice(0, 22) + "…" : t) : active.title;

    const next = conversations.map((c) =>
      c.id === active.id ? { ...c, title: newTitle, messages: [...c.messages, userMsg, assistantMsg] } : c
    );

    setConversations(next);
    setText("");
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-[280px] border-r border-black/10 bg-white">
          <div className="flex items-center justify-between px-4 py-4 border-b border-black/10">
            <div>
              <div className="text-sm font-bold text-black">Chatbox</div>
              <div className="text-xs text-black/60">Local demo</div>
            </div>
            <button
              type="button"
              className="text-xs px-3 py-1 rounded-full bg-black text-white"
              onClick={onNewChat}
            >
              + Mới
            </button>
          </div>

          <div className="h-[calc(100vh-66px)] overflow-auto">
            {conversations.map((c) => (
              <div key={c.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={
                    "flex-1 text-left px-4 py-3 hover:bg-black/5 " +
                    (c.id === activeId ? "bg-black/5 font-semibold" : "text-black/80")
                  }
                >
                  <div className="text-sm line-clamp-1">{c.title}</div>
                  <div className="text-xs text-black/50">{new Date(c.createdAt).toLocaleString()}</div>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteChat(c.id)}
                  className="opacity-0 group-hover:opacity-100 px-3 text-black/40 hover:text-black"
                  title="Xóa"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
            <div className="text-sm font-semibold text-black">{active?.title || "—"}</div>
            <div className="text-xs text-black/50">Chat lưu localStorage</div>
          </div>

          <div ref={listRef} className="flex-1 overflow-auto px-6 py-6">
            {active?.messages?.map((m) => (
              <div key={m.id} className={"mb-3 flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={
                    "max-w-[520px] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-black text-white rounded-br-md"
                      : "bg-black/5 text-black rounded-bl-md")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={onSend} className="p-4 border-t border-black/10">
            <div className="flex items-center gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 h-12 rounded-full border border-black/10 px-5 text-sm outline-none focus:border-black/30"
                placeholder="Nhập tin nhắn…"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-full bg-black text-white text-sm font-semibold disabled:opacity-40"
                disabled={!text.trim()}
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
