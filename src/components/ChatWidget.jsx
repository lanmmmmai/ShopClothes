import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ChatWidget (localStorage, không cần backend)
 * - Nút chat nổi góc phải dưới
 * - Panel chat nhỏ (giống kiểu Chatbox)
 * - Có danh sách hội thoại + tin nhắn + input gửi
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
        content:
          "Xin chào! Mình là chatbox. Bạn muốn hỏi gì về shop/thời trang/đơn hàng?",
        at: Date.now(),
      },
    ],
  };
}

function botReply(userText) {
  const t = (userText || "").trim();
  if (!t) return "Bạn gửi mình câu hỏi nhé 🙂";
  // Trả lời demo (echo) — bạn có thể thay bằng API sau
  return `Mình đã nhận: "${t}". (Demo) Nếu bạn muốn, mình có thể tư vấn size, sản phẩm hoặc hỗ trợ đơn hàng.`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState(() => loadConversations());
  const [activeId, setActiveId] = useState(() => {
    const convs = loadConversations();
    return convs[0]?.id || null;
  });
  const [text, setText] = useState("");

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);

  const listRef = useRef(null);

  // init
  useEffect(() => {
    if (conversations.length === 0) {
      const first = makeNewConversation();
      setConversations([first]);
      setActiveId(first.id);
      saveConversations([first]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // auto scroll
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, active?.messages?.length]);

  function ensureActive() {
    if (activeId && conversations.some((c) => c.id === activeId)) return;
    if (conversations[0]) setActiveId(conversations[0].id);
  }

  useEffect(() => {
    ensureActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length]);

  function onNewChat() {
    const c = makeNewConversation();
    const next = [c, ...conversations];
    setConversations(next);
    setActiveId(c.id);
    setOpen(true);
  }

  function onDeleteChat(id) {
    const next = conversations.filter((c) => c.id !== id);
    setConversations(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
  }

  function onSend(e) {
    e?.preventDefault?.();
    const t = text.trim();
    if (!t || !active) return;

    const userMsg = { id: uid(), role: "user", content: t, at: Date.now() };
    const assistantMsg = { id: uid(), role: "assistant", content: botReply(t), at: Date.now() };

    // update title if new
    const newTitle =
      active.title === "Cuộc trò chuyện mới" ? (t.length > 22 ? t.slice(0, 22) + "…" : t) : active.title;

    const next = conversations.map((c) =>
      c.id === active.id
        ? {
            ...c,
            title: newTitle,
            messages: [...c.messages, userMsg, assistantMsg],
          }
        : c
    );

    setConversations(next);
    setText("");
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[9999] flex items-center justify-center w-14 h-14 rounded-full bg-black text-white shadow-lg"
        aria-label="Open chat"
        title="Chatbox"
      >
        {/* simple bubble icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 12c0 4.418-3.582 8-8 8-1.192 0-2.322-.261-3.337-.729L4 20l1.01-3.03A7.963 7.963 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[9999] w-[380px] h-[540px] bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-white">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black">Chatbox</span>
              <span className="text-xs text-black/60">Hỗ trợ nhanh (local)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs px-3 py-1 rounded-full border border-black/10 hover:border-black/30"
                onClick={onNewChat}
                title="Tạo chat mới"
              >
                + Mới
              </button>
              <button
                type="button"
                className="text-xs px-3 py-1 rounded-full border border-black/10 hover:border-black/30"
                onClick={() => setOpen(false)}
                title="Đóng"
              >
                Đóng
              </button>
            </div>
          </div>

          <div className="flex h-[calc(540px-52px)]">
            {/* Left: conversations */}
            <div className="w-[130px] border-r border-black/10 bg-white">
              <div className="px-2 py-2 text-[11px] font-semibold text-black/70">HỘI THOẠI</div>
              <div className="h-[calc(540px-52px-28px)] overflow-auto">
                {conversations.map((c) => (
                  <div key={c.id} className="group flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={
                        "flex-1 text-left px-2 py-2 text-[11px] leading-tight hover:bg-black/5 " +
                        (c.id === activeId ? "bg-black/5 font-semibold" : "text-black/80")
                      }
                      title={c.title}
                    >
                      {c.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteChat(c.id)}
                      className="opacity-0 group-hover:opacity-100 px-2 text-black/40 hover:text-black"
                      title="Xóa"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: messages */}
            <div className="flex-1 flex flex-col">
              <div ref={listRef} className="flex-1 overflow-auto px-3 py-3 bg-white">
                {active?.messages?.map((m) => (
                  <div
                    key={m.id}
                    className={
                      "mb-2 flex " + (m.role === "user" ? "justify-end" : "justify-start")
                    }
                  >
                    <div
                      className={
                        "max-w-[220px] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap " +
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

              <form onSubmit={onSend} className="p-3 border-t border-black/10 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 h-10 rounded-full border border-black/10 px-4 text-sm outline-none focus:border-black/30"
                    placeholder="Nhập tin nhắn…"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-full bg-black text-white text-sm font-semibold disabled:opacity-40"
                    disabled={!text.trim()}
                  >
                    Gửi
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-black/50">
                  Mẹo: chat được lưu ở localStorage (xóa localStorage là mất).
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
