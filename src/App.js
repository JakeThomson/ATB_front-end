import React from 'react';
import './css/App.css';
import './bootstrap.min.css';
import AtList from './components/AtList.js';
import CtList from './components/CtList.react.js';
import TotalProfit from './components/TotalProfit.react.js';
import AtStats from './components/AtStats.react.js';
import SuccessRate from './components/SuccessRate.react.js';
import WorldFlow from './components/WorldFlow.react.js';
import News from './components/News.react.js';
import TradeStats from './components/TradeStats.react';

function App() {
  return (
    <div id="wrapper">
      <div id="content">
        <WorldFlow playpause="play" date="02/01/2015" />
        <AtStats qty="0" val="£0.0k" />
        <AtList/>
        <CtList/>
        <News/>
        <div id="trade-stats-container">
          <TradeStats/>
          <TotalProfit totalValue="£10,123" totalPct="(+34.4%)" figure="" />
          <SuccessRate pct="68%" />
        </div>
      </div>
      <div className="background">
        <div id="bg-square-1"/>
        <div id="bg-square-2"/>
        <div id="bg-square-3"/>
        <div id="bg-square-4"/>
      </div>
    </div>
  );
}

export default App;
