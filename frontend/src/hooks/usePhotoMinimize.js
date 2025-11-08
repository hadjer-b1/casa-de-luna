import { useEffect } from "react";

export default function usePhotoMinimize(selector = ".photo-minimize", options = {}) {
  const { threshold = 0.5, maxWidth = 768 } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth > maxWidth) return;  

    const els = Array.from(document.querySelectorAll(selector));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("photo-minimize--active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, threshold, maxWidth]);
}