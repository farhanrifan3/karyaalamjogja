"use client";

import { useEffect, useState } from "react";

import { processChatConversation } from "@/lib/cms/chatbot";
import { whatsappLink } from "@/lib/whatsapp";
import { BotIcon, CloseIcon } from "@/components/site/icons";

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

function initialMessage(brandName: string): Message {
  return {
    sender: "bot",
    text: `Halo! Saya Asisten RAB ${brandName}. Spesialis kolam koi, kolam renang, tebing, taman, dan batu alam sejak 1986.\n\nContoh format tulis ukuran:\n👉 "taman 1,5x6"\n👉 "kolam koi 4x3"\n\nAda proyek apa yang ingin Anda diskusikan hari ini?`,
  };
}

export function ChatbotWidget({
  brandName,
  whatsapp,
}: {
  brandName: string;
  whatsapp: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    initialMessage(brandName),
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      /* riwayat rusak diabaikan */
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  function handleResetChat() {
    setMessages([initialMessage(brandName)]);
  }

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    const updatedMessages = [
      ...messages,
      { sender: "user" as const, text: userText },
    ];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages.map((message) => ({
        sender: message.sender,
        text: message.text,
      }));
      const response = await processChatConversation(history, userText);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.reply, rab: response.rab },
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
    <>
      <button
        className="bot-launch"
        type="button"
        aria-expanded={isOpen}
        aria-controls="botPanel"
        onClick={() => setIsOpen((open) => !open)}
      >
        <BotIcon />
        Hitung RAB
      </button>

      <section
        className="bot-panel"
        id="botPanel"
        aria-labelledby="botTitle"
        hidden={!isOpen}
      >
        <header className="bot-head">
          <span className="bot-head__avatar">
            <BotIcon className="ic ic--sm" />
          </span>
          <span>
            <strong id="botTitle">Asisten RAB Karya Alam</strong>
            <span>Estimasi awal · bukan penawaran final</span>
          </span>
          <button
            type="button"
            className="bot-reset"
            onClick={handleResetChat}
            title="Mulai percakapan baru"
          >
            Mulai baru
          </button>
          <button
            className="bot-close"
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup asisten RAB"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="bot-log" aria-live="polite">
          {messages.map((message, index) => (
            <div
              className={`bubble${message.sender === "user" ? " bubble--user" : ""}`}
              key={index}
              style={{ whiteSpace: "pre-line" }}
            >
              {message.sender === "bot" ? message.text : message.text}

              {message.rab ? (
                <div style={{ marginTop: "0.65rem" }}>
                  <strong style={{ display: "block", marginBottom: "0.35rem" }}>
                    {message.rab.title}
                  </strong>
                  {message.rab.categories.map((category) => (
                    <div className="est-row" key={category.name}>
                      <span>
                        {category.name}
                        <span className="bubble__small">{category.detail}</span>
                      </span>
                      <span>Rp{category.cost.toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                  <div className="bubble__total">
                    <span>Estimasi total</span>
                    <span>Rp{message.rab.total.toLocaleString("id-ID")}</span>
                  </div>
                  <span className="bubble__small">{message.rab.disclaimer}</span>
                  <a
                    className="btn btn--lime btn--sm btn--block"
                    style={{ marginTop: "0.6rem" }}
                    href={whatsappLink(
                      `Halo ${brandName}, saya ingin konsultasi RAB berdasarkan hitungan chatbot: ${message.rab.title} (Estimasi Total: Rp${message.rab.total.toLocaleString("id-ID")})`,
                      whatsapp,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kirim RAB ke WhatsApp
                  </a>
                </div>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div className="bubble">
              <span className="bubble__small" style={{ marginTop: 0 }}>
                Asisten sedang merespons...
              </span>
            </div>
          ) : null}
        </div>

        <div className="bot-controls">
          <form className="bot-form" onSubmit={handleSend}>
            <div className="bot-form__row" style={{ gridTemplateColumns: "1fr auto" }}>
              <label className="sr-only" htmlFor="botInput">
                Tulis kebutuhan atau ukuran
              </label>
              <input
                id="botInput"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Contoh: taman 1,5x6..."
              />
              <button className="btn btn--dark btn--sm" type="submit">
                Kirim
              </button>
            </div>
          </form>
          <p className="bot-note">
            Estimasi awal dari ukuran yang Anda tulis. Angka final dikonfirmasi
            setelah survei.
          </p>
        </div>
      </section>
    </>
  );
}
