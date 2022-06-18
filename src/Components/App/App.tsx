import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from '../MainPage/MainPage';

import PageHeader from '../PageHeader/PageHeader';
import SpecificTokenPage from '../SpecificTokenPage/SpecificTokenPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <PageHeader/>
        <Routes>
          <Route path='/CryptoTracker-v2/' element={<MainPage/>} />
          <Route path='/CryptoTracker-v2/info_:id' element={<SpecificTokenPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
