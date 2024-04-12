import { useState } from 'react'
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <div>
      <Navbar/>
    </div>
    <style jsx global>
      {`
      body{
        margin:0;
        padding:0;
      }
      `}
    </style>
    </>
  );
}

export default App;
