import { useEffect } from "react";

export default function useScrollReveal(selector = ".reveal", options = {}) {
  const serializedOptions = JSON.stringify(options || {});

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
             observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
        ...options,
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, serializedOptions, options]);
}