
// Nitin Debugs

// How to set expiry in localStorage or sessionStorage?

const data = {
    value: "nitin",
    expiry: Date.now() + 5 * 1000 * 60
}

localStorage.setItem("data", JSON.stringify(data));

function getItem(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const item = JSON.parse(raw);

  if (Date.now() >= item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
