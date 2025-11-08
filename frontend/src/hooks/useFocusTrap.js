import { useEffect, useRef } from "react";

 
export default function useFocusTrap(containerRef, active, options = {}) {
  const previousFocusedRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef?.current;
    if (!container) return;

     previousFocusedRef.current = document.activeElement;

     const focusableSelectors = [
      "a[href]",
      "area[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      '[tabindex]:not([tabindex="-1"])',
      "[contenteditable]",
    ].join(",");

    const nodes = Array.from(
      container.querySelectorAll(focusableSelectors)
    ).filter(
      (n) =>
        n.offsetWidth > 0 || n.offsetHeight > 0 || n.getClientRects().length
    );

    if (nodes.length) nodes[0].focus();

    function handleKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        options.onDeactivate?.();
        return;
      }

      if (e.key !== "Tab") return;

       const focusable = nodes;
      if (!focusable.length) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
       try {
        previousFocusedRef.current?.focus?.();
      } catch (err) {
        /* ignore */
      }
    };
  }, [containerRef, active, options]);
}
