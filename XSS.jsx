// Example 3

import DOMPurify from "dompurify";

const cleanHTML = DOMPurify.sanitize(userInput);

<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />



// Example 1
function App() {
  const userInput = "<img src=x onerror=\"alert('Hacked!')\" />";

  return (
    <div>
      <h2>User comment:</h2>
      <div>{userInput}</div>
    </div>
  );
}

// Example 2
function App() {
  const userInput = "<img src=x onerror=\"alert('Hacked!')\" />";

  return (
    <div>
      <h2>User comment:</h2>

      <div
        dangerouslySetInnerHTML={{ __html: userInput }}
      />
    </div>
  );
}





// Hey, this is HTML. Parse it.

             SAME USER INPUT

"<img src=x onerror="alert('XSS')">"


   SAFE React              DANGEROUS React

   {userInput}             dangerouslySetInnerHTML
       ↓                           ↓
   Displays text              Parses as HTML
       ↓                           ↓
       ✅                         💥