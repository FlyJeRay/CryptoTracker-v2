import React, { useEffect, useState } from "react";

import "./MainPage.css"

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
  data: TokenData[],
  timestamp: number
}

function MainPage() {
  const [Currencies, SetCurrencies] = useState<FetchedData>();

  useEffect(() => {
    PullCurrencies();
  }, []);

  const ConvertPrice = (price: string | undefined) => {
    if (price) {
      const convertedPrice: string = `$${parseFloat(price).toFixed(2)}`
      return convertedPrice;
    }
    else return '';
  }

  const GoToTokenPage = (tokenName?: string) => {
    if (tokenName) {
      window.location.href = `/info_${tokenName}`;
    }
    else {
      // in case if tokenName is undefined (I don't know, why would that happen, but that is possible),
      // user will be redirected to bitcoin info as a placeholder token
      window.location.href = '/info_bitcoin';
    }
  }
  
  const DisplayBiggestChange = () => {
    let biggestChange: number = 0;
    let changeColor: string = 'white';
     // bitcoin is just written as a placeholder token
    let tokenWithBiggestChange: string = 'Bitcoin';
    let tokenID: string = 'bitcoin';

    Currencies?.data.forEach((cur) => {
      if (Math.abs(parseFloat(cur.changePercent24Hr)) > biggestChange) {
        biggestChange = parseFloat(parseFloat(cur.changePercent24Hr).toFixed(2));
        tokenWithBiggestChange = cur.name;
        tokenID = cur.id;
      }
    });

    const changeConvertedToString: string = biggestChange > 0 ? `+${biggestChange}%` : `${biggestChange.toString()}%`;
    changeColor = biggestChange > 0 ? '#03c9a9' : '#f22613';

    return (
      <div onClick={() => GoToTokenPage(tokenID)} className="biggest_change_block">
        <h2 style={{'color': changeColor}}> {changeConvertedToString} </h2>
        <p> {tokenWithBiggestChange} </p>
      </div>
    )
  }

  const DisplayTopSixCurrencies = () => {
    return(
      <div className="top6_block">
        <div className="top6_block_row">
          <div onClick={() => GoToTokenPage(Currencies?.data[0].id)} className="top6_currency">
            <h4>{Currencies?.data[0].name}</h4>
            <p>{ConvertPrice(Currencies?.data[0].priceUsd)}</p>
          </div>
          <div onClick={() => GoToTokenPage(Currencies?.data[1].id)} className="top6_currency">
            <h4>{Currencies?.data[1].name}</h4>
            <p>{ConvertPrice(Currencies?.data[1].priceUsd)}</p>
          </div>
        </div>
        <div className="top6_block_row">
          <div onClick={() => GoToTokenPage(Currencies?.data[2].id)} className="top6_currency">
            <h4>{Currencies?.data[2].name}</h4>
            <p>{ConvertPrice(Currencies?.data[2].priceUsd)}</p>
          </div>
          <div onClick={() => GoToTokenPage(Currencies?.data[3].id)} className="top6_currency">
            <h4>{Currencies?.data[3].name}</h4>
            <p>{ConvertPrice(Currencies?.data[3].priceUsd)}</p>
          </div>
        </div>
        <div className="top6_block_row">
          <div onClick={() => GoToTokenPage(Currencies?.data[4].id)} className="top6_currency">
            <h4>{Currencies?.data[4].name}</h4>
            <p>{ConvertPrice(Currencies?.data[4].priceUsd)}</p>
          </div>
          <div onClick={() => GoToTokenPage(Currencies?.data[5].id)} className="top6_currency">
            <h4>{Currencies?.data[5].name}</h4>
            <p>{ConvertPrice(Currencies?.data[5].priceUsd)}</p>
          </div>
        </div>
      </div>
    )
  }

  const PullCurrencies = async () => {
    const data = await fetch('https://api.coincap.io/v2/assets');
    const json: FetchedData = await data.json();

    SetCurrencies(json);
  }

  return(
    <div className="mainpage">
      <div className="mainpage_top_block">
        {
          DisplayTopSixCurrencies()
        }
        {
          DisplayBiggestChange()
        }
      </div>
    </div>
  )
}

export default MainPage;