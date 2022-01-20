import React from 'react';
import { useToggle } from 'react-use';
import { DatePicker } from './components';

function App() {
  const [open, toggleOpen] = useToggle(false);

  return (
    <div className="container">
      <div className="example">
        <p>default :</p>
        <DatePicker />
      </div>
      <div className="example">
        <p>without input:</p>
        <button onClick={toggleOpen}>controled picker</button>
        <DatePicker input={false} open={open} />
      </div>
    </div>
  );
}

export default App;
