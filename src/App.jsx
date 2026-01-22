import { useState } from 'react'
import PlaneOsb from './Main/PlaneOsb'
import './App.css'

function App() {
  return (
    <>
      {/* Fixed overlay component */}
      <div className="fixed inset-0 ">
        <PlaneOsb />
      </div>
    </>
  );
}

export default App;

