
import { useState, useEffect } from "react";

// Nakli backend
const mock = () =>
  Promise.resolve([
    { id: 1, name: "Pulkit Mani" },
    { id: 2, name: "Shyam Rangeela" },
  ]);

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    mock()
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}