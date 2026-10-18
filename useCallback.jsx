// Nitin Debugs

const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);

// ❌ USELESS USE CASE: Passing to a native HTML button

// Native HTML elements don't benefit from memoized references!

<button onClick={handleClick}>Click</button>;

// ✅ VALID USE CASE 2: Inside a useEffect dependency array

const fetchUserData = useCallback(async () => {
  const data = await fetchUser(userId);
  setUser(data);
}, [userId]);

useEffect(() => {
  fetchUserData();
}, [fetchUserData]);

// Stable reference prevents infinite loop!
