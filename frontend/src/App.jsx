import { useState } from 'react'

import './App.css'

function App() {
  const [counter, setCounter] = useState(15)
   const addValue = () => {
    if(counter >= 20) return 
    setCounter(counter + 1)

   }
   const removeValue = () => {
    if(counter <= 0) return
    setCounter(counter - 1)
   }
  return (
    <>
 {/* <h2 class= 'text-3xl font-bold underline'>Code with react</h2>
 <h2 class='text-xl fondt-bold'>Counter value: {counter}</h2> 
 <button onClick={addValue} class='bg-sky-500 hover:bg-sky-700'>Add value</button>
 <button onClick={removeValue} class='bg-orange-500 hover:bg-yellow-700'>Remove Value</button> */}
    </>
  )
}



export default App
