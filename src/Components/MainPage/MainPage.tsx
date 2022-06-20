import React, { useEffect, useState, useRef, MutableRefObject, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { TokenContext } from "../../tokenContext";

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
  const navigate = useNavigate();
  const { ctx_value, ctx_setter } = useContext(TokenContext);

  const [Currencies, SetCurrencies] = useState<FetchedData>();
  const [FilteredTokens, SetFilteredTokens] = useState<TokenData[]>();

  const MaxPriceInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const MinPriceInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const MaxChangeInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const MinChangeInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    PullCurrencies();
  }, []);

  useEffect(() => {
    FilterTokens();
  }, [Currencies]);

  const ConvertPrice = (price: string | undefined) => {
    if (price) {
      const convertedPrice: string = `$${parseFloat(price).toFixed(2)}`
      return convertedPrice;
    }
    else return '';
  }

  const GoToTokenPage = (tokenName?: string) => {
    if (tokenName) {
      ctx_setter(tokenName);
    }
    navigate('/CryptoTracker-v2/info')
  }

  const FilterTokens = () => {
    const maxPrice: number = MaxPriceInputRef.current && typeof MaxPriceInputRef.current.value !== 'undefined' ? parseFloat(MaxPriceInputRef.current.value) : 99999;
    const minPrice: number = MinPriceInputRef.current && typeof MinPriceInputRef.current.value !== 'undefined' ? parseFloat(MinPriceInputRef.current.value) : 0;
    const maxChange: number = MaxChangeInputRef.current && typeof MaxChangeInputRef.current.value !== 'undefined' ? parseFloat(MaxChangeInputRef.current.value) : 99999;
    const minChange: number = MinChangeInputRef.current && typeof MinChangeInputRef.current.value !== 'undefined' ? parseFloat(MinChangeInputRef.current.value) : -99999;

    const FilteredArray: TokenData[] | undefined = Currencies?.data.filter((cur) => {
      const price = parseFloat(cur.priceUsd);
      const change = parseFloat(cur.changePercent24Hr);

      if (price > maxPrice || price < minPrice || change > maxChange || change < minChange) {
        return false;
      }
      else {
        return true;
      }
    });

    SetFilteredTokens(FilteredArray);
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
      <h3 className="token_list_title">List of All Tokens</h3>
      <div className="token_sort_block">
        <input ref={MinPriceInputRef} onChange={FilterTokens} className="input_price" type={'number'} placeholder='Min Price' />
        <input ref={MaxPriceInputRef} onChange={FilterTokens} className="input_price" type={'number'} placeholder='Max Price' />
        <input ref={MinChangeInputRef} onChange={FilterTokens} className="input_change" type={'number'} placeholder='Min Change' />
        <input ref={MaxChangeInputRef} onChange={FilterTokens} className="input_change" type={'number'} placeholder='Max Change' />
      </div>
      <div className="token_list">
        {
          FilteredTokens?.map((token) => {
            return <div onClick={() => GoToTokenPage(token.id)} className="currency">
              <h4>{token.name}</h4>
              <p>{ConvertPrice(token.priceUsd)}</p>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default MainPage;