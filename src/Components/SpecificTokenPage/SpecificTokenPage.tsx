import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';

import "./SpecificTokenPage.css"

interface TokenData {
  id: string,
  rank: string,
  symbol: string,
  name: string,
  supply: string,
  maxSupply: string,
  marketCapUsd: string,
  volumeUsd24Hr: string,
  priceUsd: string,
  changePercent24Hr: string,
  vwap24Hr: string
}

interface FetchedData {
  data: TokenData,
  timestamp: number
}

interface FetchedPriceData {
  data: [{
    priceUsd: string,
    time: number,
    date: string
  }],
  timestamp: number
}

function SpecificTokenPage() {
  const [FetchedData, SetFetchedData] = useState<FetchedData>();

  const [ChartData, SetChartData] = useState<{x: number, y: number}[]>([]);
  const [ChartXAxis, SetChartXAxis] = useState<number[]>([]);
  const [CurrentGraphWidth, SetCurrentGraphWidth] = useState<number>(900);

  const [TokenPrice, SetTokenPrice] = useState<string>('');
  const [MarketCap, SetMarketCap] = useState<string>('');

  const [PercentChange, SetPercentChange] = useState<string>('');
  const [PercentChangeColor, SetPercentChangeColor] = useState<string>('');

  useEffect(() => {
    ConvertTokenPrice();
    ConvertPercentChange();
    ConvertMarketCap();
  }, [FetchedData]);

  useEffect(() => {
    if (isPhone.valueOf()) {
      onPhoneSizeHandle(true);
    }
    else if (isTablet.valueOf()) {
      onTabletSizeHandle(true);
    }
    else if (isDesktop.valueOf()) {
      onDesktopSizeHandle(true);
    }
    
    PullTokenData();
  }, []);

  const onPhoneSizeHandle = (matches: boolean) => {
    if (matches) {
      SetCurrentGraphWidth(300);
    }
  }

  const onTabletSizeHandle = (matches: boolean) => {
    if (matches) {
      SetCurrentGraphWidth(700);
    }
  }

  const onDesktopSizeHandle = (matches: boolean) => {
    if (matches) {
      SetCurrentGraphWidth(900);
    }
  }

  const isPhone = useMediaQuery(
    {maxWidth: 500}, undefined, onPhoneSizeHandle
  )

  const isTablet = useMediaQuery(
    {minWidth:501, maxWidth: 950}, undefined, onTabletSizeHandle
  )
  
  const isDesktop = useMediaQuery(
    {minWidth: 951}, undefined, onDesktopSizeHandle
  )

  const ConvertTokenPrice = () => {
    let NewTokenPrice: string;

    if (FetchedData?.data.priceUsd) {
      NewTokenPrice = `$${parseFloat(FetchedData?.data.priceUsd).toFixed(6)}`;
    }
    else {
      NewTokenPrice = "";
    }

    SetTokenPrice(NewTokenPrice);
  }

  const ConvertPercentChange = () => {
    let NewPercentChange: string;
    let NewPercentChangeColor: string;

    if (FetchedData?.data.changePercent24Hr) {
      const floatPercent: number = parseFloat(FetchedData?.data.changePercent24Hr);
      NewPercentChange = floatPercent > 0 ? `+${floatPercent.toFixed(2)}%` : `${floatPercent.toFixed(2)}%`;

      NewPercentChangeColor = floatPercent > 0 ? '#03c9a9' : '#f22613';
    }
    else {
      NewPercentChange = "";
      NewPercentChangeColor = 'white';
    }

    SetPercentChange(NewPercentChange);
    SetPercentChangeColor(NewPercentChangeColor);
  }

  const ConvertMarketCap = () => {
    let NewMarketCap: string;

    if (FetchedData?.data.changePercent24Hr) {
      const floatMarketCap: number = parseFloat(FetchedData?.data.marketCapUsd);
      NewMarketCap = `Market Cap: $${floatMarketCap.toFixed(2)}`;
    }
    else {
      NewMarketCap = "";
    }

    SetMarketCap(NewMarketCap);
  }

  const PullChartData = async (tokenName: string) => {
    const endDate = new Date();

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 8);

    const data = await fetch(`https://api.coincap.io/v2/assets/${tokenName}/history?start=${startDate.getTime()}&end=${endDate.getTime()}&interval=d1`);
    const json: FetchedPriceData = await data.json();

    const newChartData: {x: number, y: number}[] = [];
    const newXAxis: number[] = [];

    json.data.forEach((dataBlock) => {
      const y: number = parseFloat(parseFloat(dataBlock.priceUsd).toFixed(2));

      const date: Date = new Date(dataBlock.time);
      const x: number = date.getDate();

      const chartBlock: {x: number, y: number} = {x, y};

      newChartData.push(chartBlock);
      newXAxis.push(x);
    });

    SetChartData(newChartData);
    SetChartXAxis(newXAxis);
  }
 
  const PullTokenData = async () => {
    const token = sessionStorage.getItem('ctv2-token-id-saved');

    const data = await fetch(`https://api.coincap.io/v2/assets/${token}`);
    const json: FetchedData = await data.json();

    SetFetchedData(json);
    PullChartData(json.data.id);
  }

  return(
    <div>
      <div className="specific_token_block">
        <h4>{FetchedData?.data.name}</h4>
        <p className="token_symbol">{FetchedData?.data.symbol}</p>
        <div className="price_block">
          <p>{TokenPrice}</p>
          <p style={{'color': PercentChangeColor}}>{PercentChange}</p>
        </div>
        <p>{MarketCap}</p>
        <p className="price_history_title">Price History of {FetchedData?.data.name} for last week</p>
        <XYPlot style={{'fontFamily': 'Kanit', fill: 'none'}} height={300} width={CurrentGraphWidth}>
          <LineSeries 
            color={'white'}
            data={ChartData} />
          <VerticalGridLines style={{'stroke': 'gray'}}/>
          <HorizontalGridLines style={{'stroke': 'gray'}}/>
          <XAxis 
            style={{
              line: {stroke: '#ADDDE1'},
              ticks: {stroke: '#ADDDE1'},
              fontSize: 16
            }}
            tickFormat= {val => Math.round(val) === val ? val:''}
            tickValues= {ChartXAxis} />
          <YAxis
            style={{
              line: {stroke: '#ADDDE1'},
              ticks: {stroke: '#ADDDE1'},
              fontSize: 7
            }} />
        </XYPlot>
      </div>
    </div>
  )
}

export default SpecificTokenPage;