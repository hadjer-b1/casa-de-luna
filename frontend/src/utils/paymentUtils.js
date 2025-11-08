import Payment from "payment";

export function maskCard(number) {
  if (!number) return "-";
  const digits = String(number).replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  const last4 = digits.slice(-4);
  return "**** **** **** " + last4;
}

export function validateExpiry(value) {
  if (!value) return false;
  const m = String(value).trim();
  // Accepted formats: MM/YY or MM/YYYY or MM-YY
  const re = /^(0[1-9]|1[0-2])[-/]?(\d{2}|\d{4})$/;
  return re.test(m);
}

function clearNumber(value = "") {
  return String(value).replace(/\D+/g, "");
}

export function formatCreditCardNumber(value = "") {
  if (!value) return value;
  const clearValue = clearNumber(value).slice(0, 19);
  let issuer = null;
  try {
    issuer = Payment && Payment.fns && Payment.fns.cardType(clearValue);
  } catch (e) {
    issuer = null;
  }

  let nextValue;
  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value = "", cardType = null) {
  const clearValue = clearNumber(value);
  let maxLength = 3;
  if (cardType === "amex") maxLength = 4;
  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value = "") {
  const clearValue = clearNumber(value);
  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }
  return clearValue;
}
