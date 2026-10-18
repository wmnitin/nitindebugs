// Nitin Debugs

const user = {
  name: "Nitin",
  createdAt: new Date(), // 💥 Converted to a plain String!
  sayHi: () => "Hello", // 💥 Silently DELETED!
  role: undefined, // 💥 Silently DELETED!
  score: NaN, // 💥 Converted to null!
};

// ❌ THE OLD HACK (Drops functions, corrupts Dates, crashes on circular refs):

const badClone = JSON.parse(JSON.stringify(user));

// ✅ THE MODERN NATIVE JAVASCRIPT WAY:
// Built into all modern browsers & Node.js (Zero libraries needed!)

const perfectClone = structuredClone(user);

O(N)