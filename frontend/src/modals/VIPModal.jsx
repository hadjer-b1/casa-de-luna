import React from "react";
import VIPModel from "../models/VIPModel";
import { useToast } from "../components/Toast";

export default function VIPModal({ isOpen, onClose }) {
  const toast = useToast();

  const handleJoin = async (payload) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/vip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.addToast("You joined VIP! A confirmation email was sent.", {
          type: "info",
        });
        onClose?.();
        window.dispatchEvent(new CustomEvent("vipJoined", { detail: payload }));
      } else {
        const txt = await res.text().catch(() => "Failed to join VIP");
        toast.addToast(`VIP registration failed: ${txt}`, { type: "error" });
      }
    } catch (err) {
      toast.addToast(err?.message || "Network error", { type: "error" });
    }
  };

  return <VIPModel open={isOpen} onClose={onClose} onJoin={handleJoin} />;
}
