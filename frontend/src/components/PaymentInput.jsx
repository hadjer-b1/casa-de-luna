import React, { useState, useEffect } from "react";

 

export default function PaymentInput({
  name,
  value = "",
  onChange = () => {},
  formatter,
  rawMode = false,
  placeholder = "",
  className = "",
  type = "text",
}) {
  const [display, setDisplay] = useState(value || "");

  useEffect(() => {
     setDisplay(value || "");
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value;
    const formatted = formatter ? formatter(raw) : raw;
    setDisplay(formatted);

     let out = formatted;
    if (!rawMode) {
       if (name === "number" || /cvc|cvv/i.test(name)) {
        out = String(formatted).replace(/\D/g, "");
      } else {
        out = formatted;
      }
    }

    onChange({ target: { name, value: out } });
  };

  return (
    <input
      name={name}
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      type={type}
      inputMode={name === "number" ? "numeric" : undefined}
      autoComplete="off"
    />
  );
}
