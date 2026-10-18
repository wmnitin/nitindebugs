const socketRef = useRef(null);

useEffect(() => {
  const socket = new WebSocket("ws://localhost:3001");
  socketRef.current = socket;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    setMessages((prev) => [...prev, message]);
  };

  return () => socket.close();
}, []);

function sendMessage() {
  if (socketRef.current?.readyState !== WebSocket.OPEN) return;

  socketRef.current.send(JSON.stringify({ text }));
  setText("");
}