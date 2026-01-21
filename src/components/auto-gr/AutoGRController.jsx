// src/auto-gr/AutoGRController.jsx
// ===================================================
// AUTO GR LIST — URL BASED CONTROLLER
// ---------------------------------------------------
// - Αυτόνομο subsystem
// - Ακούει το URL (/shortlist)
// - Ανοίγει / κλείνει modal
// - ΔΕΝ αγγίζει App.jsx logic
// ===================================================

import React, { useEffect, useState } from "react";
import AutoGRModal from "./AutoGRModal";

export default function AutoGRController() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkUrl = () => {
      const path = window.location.pathname;
      setOpen(path === "/shortlist");
    };

    // αρχικός έλεγχος
    checkUrl();

    // listener για back / forward
    window.addEventListener("popstate", checkUrl);

    return () => {
      window.removeEventListener("popstate", checkUrl);
    };
  }, []);

  const closeModal = () => {
    // επιστροφή στο προηγούμενο URL
    window.history.back();
  };

  if (!open) return null;

  return <AutoGRModal onClose={closeModal} />;
}
