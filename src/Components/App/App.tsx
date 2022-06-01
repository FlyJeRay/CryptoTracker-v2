import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from '../Footer/Footer';
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
          <Route path='/CryptoTracker-v2' element={<MainPage/>} />
          <Route path='/CryptoTracker-v2/info_:id' element={<SpecificTokenPage/>}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
