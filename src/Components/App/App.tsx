import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TokenContext } from '../../tokenContext';
import MainPage from '../MainPage/MainPage';

import PageHeader from '../PageHeader/PageHeader';
import SpecificTokenPage from '../SpecificTokenPage/SpecificTokenPage';
import './App.css';

function App() {
  const [contextVal, setContextVal] = useState<string>('bitcoin')

  return (
    <Router>
      <div className="App">
        <TokenContext.Provider value={ { ctx_value: contextVal, ctx_setter: setContextVal } }>
          <PageHeader/>
          <Routes>
            <Route path='/CryptoTracker-v2/' element={<MainPage/>} />
            <Route path='/CryptoTracker-v2/info' element={<SpecificTokenPage/>}/>
          </Routes>
        </TokenContext.Provider>
      </div>
    </Router>
  );
}

export default App;
