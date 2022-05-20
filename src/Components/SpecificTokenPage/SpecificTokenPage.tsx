import React, { useEffect, useState } from "react";

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

function SpecificTokenPage() {
  const [FetchedData, SetFetchedData] = useState<FetchedData>();

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
    PullTokenData();
  }, []);

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
 
  const PullTokenData = async () => {
    // Getting token name from URL.
    // -- Example:  url is '/info_bitcoin'
    // -- Splits into '/info' and 'bitcoin'
    // -- 'token' assigns to 'bitcoin'
    const url = window.location.pathname;
    const token = url.split('_')[1];

    const data = await fetch(`https://api.coincap.io/v2/assets/${token}`);
    const json = await data.json();

    SetFetchedData(json);
  }

  return(
    <div>
      <div className="specific_token_block">
        <h4>{FetchedData?.data.name}</h4>
        <div className="price_block">
          <p>{TokenPrice}</p>
          <p style={{'color': PercentChangeColor}}>{PercentChange}</p>
        </div>
        <p>{MarketCap}</p>
      </div>
    </div>
  )
}

export default SpecificTokenPage;