import React from "react";

export default function OverallCertaintyCard({ level }) {
  /**
   * level: "SAFE" | "MEDIUM" | "CONTROLLED" | "REJECTED"
   */

  const MAP = {
    SAFE: {
      label: "ΑΣΦΑΛΗΣ",
      bg: "linear-gradient(135deg, #064e3b, #065f46)",
      subtitle: null,
    },
    MEDIUM: {
      label: "ΜΕΤΡΙΑ",
      bg: "linear-gradient(135deg, #a16207, #ca8a04)",
      subtitle: "Η εικόνα του αγώνα έχει αποκλίσεις – απαιτεί συνειδητή επιλογή",
    },
    CONTROLLED: {
      label: "ΕΛΕΓΧΟΜΕΝΗ",
      bg: "linear-gradient(135deg, #9a3412, #ea580c)",
      subtitle: "Η εικόνα του αγώνα έχει αποκλίσεις – απαιτεί συνειδητή επιλογή",
    },
    REJECTED: {
      label: "ΑΠΟΡΡΙΠΤΕΑ",
      bg: "linear-gradient(135deg, #450a0a, #7f1d1d)",
      subtitle: null,
    },
  };

  const cfg = MAP[level] || MAP.REJECTED;

  return (
    <div
      style={{
        marginTop: 48,
        borderRadius: 28,
        padding: "48px 32px",
        background: cfg.bg,
        textAlign: "center",
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.35em",
          fontWeight: 800,
          marginBottom: 18,
          opacity: 0.9,
        }}
      >
        ΒΑΘΜΟΣ ΣΥΝΟΛΙΚΗΣ ΒΕΒΑΙΟΤΗΤΑΣ
      </div>

      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: "0.08em",
        }}
      >
        {cfg.label}
      </div>

      {cfg.subtitle && (
        <div
          style={{
            marginTop: 18,
            fontSize: 14,
            opacity: 0.9,
            letterSpacing: "0.05em",
          }}
        >
          {cfg.subtitle}
        </div>
      )}
    </div>
  );
}
