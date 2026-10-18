// 1️⃣ SERVER: Generates a secret, unique token per session

const csrfToken = "abc123secretToken";

// 2️⃣ YOUR FRONTEND: Attaches token in a custom header

fetch("/api/transfer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken, // 👈 Explicitly added by your code!
  },
  body: JSON.stringify({ amount: 50000, to: "friend" }),
});

// 3️⃣ ATTACKER (hacker.com):
// ❌ FAILS! Browser's Same-Origin Policy (SOP) prevents
// the attacker from reading or stealing your X-CSRF-Token!
// Without this header, the server rejects with 403 Forbidden!
