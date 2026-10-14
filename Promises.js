// Nitin Debugs

const p1 = new Promise((resolve, reject) =>
  setTimeout(() => reject("Error"), 600),
);

const p2 = new Promise((resolve, reject) =>
  setTimeout(() => reject("Error2"), 700),
);

Promise.race([p1, p2])
  .then(console.log)
  .catch(console.log);

Promise.any([p1, p2])
  .then(console.log)
  .catch(console.log);

// Promise.all vs Promise.allSettled