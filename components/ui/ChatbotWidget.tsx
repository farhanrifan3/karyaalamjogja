"use client";

import { useState, useEffect } from "react";
import { processChatConversation } from "@/lib/cms/chatbot";
import { whatsappLink } from "@/lib/whatsapp";

type Message = {
  sender: "user" | "bot";
  text: string;
  rab?: {
    title: string;
    categories: Array<{ name: string; cost: number; detail: string }>;
    total: number;
    disclaimer: string;
  };
};

const STORAGE_KEY = "karya_alam_chat_history";

const INITIAL_MESSAGE: Message = {
  sender: "bot",
  text: "Halo! Saya Asisten AI Karya Alam. Spesialis kolam koi, kolam renang, tebing, taman, dan batu alam sejak 1986. Ada proyek apa yang ingin Anda diskusikan hari ini?",
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [INITIAL_MESSAGE];
  });
  const [loading, setLoading] = useState(false);

  // Simpan riwayat chat ke sessionStorage agar otomatis reset saat browser/tab ditutup
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  function handleResetChat() {
    const fresh = [INITIAL_MESSAGE];
    setMessages(fresh);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    const updatedMessages = [...messages, { sender: "user" as const, text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages.map((m) => ({ sender: m.sender, text: m.text }));
      const response = await processChatConversation(history, userText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.reply,
          rab: response.rab,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Maaf, terjadi kendala saat memproses percakapan. Silakan hubungi WhatsApp kami untuk konsultasi langsung.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 100 }}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#235A10",
            color: "#fff",
            border: "0",
            borderRadius: "999px",
            padding: "0.85rem 1.35rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          💬 Tanya RAB / Chat AI
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width: "380px",
            maxWidth: "90vw",
            height: "540px",
            background: "var(--sc-canvas, #081715)",
            color: "var(--sc-ink, #f0e8d6)",
            border: "1px solid var(--sc-hairline, rgba(255,255,255,0.15))",
            borderRadius: "16px",
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "0.85rem 1rem", background: "#235A10", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Asisten AI Karya Alam</div>
              <div style={{ fontSize: "0.72rem", opacity: 0.8 }}>Konsultasi & Hitung RAB Interaktif</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={handleResetChat}
                title="Mulai percakapan baru"
                style={{ background: "rgba(255,255,255,0.15)", border: "0", color: "#fff", fontSize: "0.78rem", padding: "0.3rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
              >
                🔄 Mulai Baru
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "0", color: "#fff", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
            </div>
          </div>

          <div style={{ padding: "1rem", overflowY: "auto", display: "grid", gap: "0.85rem", fontSize: "0.85rem" }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ justifySelf: m.sender === "user" ? "end" : "start", maxWidth: "90%" }}>
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    background: m.sender === "user" ? "#3fbfae" : "rgba(255,255,255,0.08)",
                    color: m.sender === "user" ? "#06211d" : "inherit",
                    lineHeight: 1.45,
                  }}
                >
                  {m.text}
                </div>

                {m.rab && (
                  <div style={{ marginTop: "0.6rem", padding: "0.9rem", borderRadius: "10px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.12)", display: "grid", gap: "0.5rem" }}>
                    <strong style={{ color: "#3fbfae", fontSize: "0.9rem" }}>{m.rab.title}</strong>
                    <div style={{ display: "grid", gap: "0.3rem", marginTop: "0.2rem" }}>
                      {m.rab.categories.map((cat: any, i: number) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", fontSize: "0.8rem", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "0.25rem" }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>{cat.name}</div>
                            <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>{cat.detail}</div>
                          </div>
                          <div style={{ fontWeight: 600, color: "#3fbfae", whiteSpace: "nowrap" }}>
                            Rp{cat.cost.toLocaleString("id-ID")}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, marginTop: "0.4rem", paddingTop: "0.4rem", borderTop: "1px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between" }}>
                      <span>Estimasi Total:</span>
                      <span style={{ color: "#3fbfae" }}>Rp{m.rab.total.toLocaleString("id-ID")}</span>
                    </div>
                    <small style={{ fontSize: "0.68rem", opacity: 0.7, lineHeight: 1.3 }}>{m.rab.disclaimer}</small>
                    <a
                      href={whatsappLink(`Halo Karya Alam, saya ingin konsultasi RAB berdasarkan hitungan chatbot: ${m.rab.title} (Estimasi Total: Rp${m.rab.total.toLocaleString("id-ID")})`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", marginTop: "0.5rem", padding: "0.5rem 0.8rem", background: "#25D366", color: "#fff", borderRadius: "6px", textAlign: "center", fontWeight: 600, fontSize: "0.78rem" }}
                    >
                      Kirim RAB ke WhatsApp →
                    </a>
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>Asisten sedang merespons...</div>}
          </div>

          <form onSubmit={handleSend} style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis ukuran atau pertanyaan..."
              style={{ flex: 1, padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)", color: "#fff", fontSize: "0.85rem" }}
            />
            <button type="submit" style={{ padding: "0.6rem 1rem", borderRadius: "8px", background: "#3fbfae", color: "#06211d", border: "0", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>Kirim</button>
          </form>
        </div>
      )}
    </div>
  );
}
