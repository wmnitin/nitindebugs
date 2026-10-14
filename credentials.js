
// NITIN DEBUGS


// What is credentials: include in fetch API?
// or
// What is withCredentials: true in axios?

fetch("https://api.example.com/profile", {
  credentials: "include"
});


axios.get("https://api.example.com/profile", {
  withCredentials: true
});

// Access-Control-Allow-Origin: domain.com
// Access-Control-Allow-Methods: GET, OPTIONS, POST
// Access-Control-Allow-Headers: TransitionEvent
// Access-Control-Allow-Credentials: true
