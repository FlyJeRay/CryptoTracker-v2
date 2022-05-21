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
        <div className="biggest_change_block"></div>
      </div>
    </div>
  )
}

export default MainPage;