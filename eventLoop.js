// Nitin Debugs


console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
});

queueMicrotask(function () {
  console.log("E");
});

console.log("F");
