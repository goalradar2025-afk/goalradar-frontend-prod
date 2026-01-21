import React from "react";

export default function RightSummaryPanel({
  homeTeam,
  awayTeam,
  advantage,
  correction,
}) {
  // 🔒 STRICT RENDER-ONLY
  // Αν το backend δεν έστειλε δεδομένα, ΔΕΝ δείχνουμε panel
  if (!advantage || !correction) return null;

  // ---------------- TEXT ----------------
  const teamText =
    advantage === "home"
      ? "του γηπεδούχου"
      : advantage === "away"
      ? "του φιλοξενούμενου"
      : "καμίας πλευράς";

  let text =
    `Η συνολική εικόνα του αγώνα δείχνει προβάδισμα ${teamText}, `;

  if (correction === "positive") {
    text +=
      "με το GR Model να ενισχύει ελαφρώς την κατεύθυνση της αγοράς.";
  } else if (correction === "negative") {
    text +=
      "όμως το GR Model κρατά επιφυλάξεις σε σχέση με την εκτίμηση της αγοράς.";
  } else {
    text +=
      "με το GR Model να βρίσκεται σε γενικές γραμμές σε συμφωνία με την αγορά.";
  }

  // ---------------- COLORS ----------------
  let background = "rgba(15,23,42,0.75)";
  let border = "rgba(255,255,255,0.12)";

  if (correction === "positive") {
    background = "rgba(16,185,129,0.12)";
    border = "rgba(16,185,129,0.35)";
  }

  if (correction === "negative") {
    background = "rgba(245,158,11,0.15)";
    border = "rgba(245,158,11,0.4)";
  }

  return (
    <div
      style={{
        borderRadius: 20,
        padding: 20,
        background,
        border: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          fontWeight: 800,
          color: "#ffffff",
        }}
      >
        ΣΥΝΟΛΙΚΗ ΕΙΚΟΝΑ ΑΓΩΝΑ
      </div>

      <div
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: "#ffffff",
        }}
      >
        {text}
      </div>
    </div>
  );
}
