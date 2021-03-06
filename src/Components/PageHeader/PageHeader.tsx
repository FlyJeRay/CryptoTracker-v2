import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { TokenContext } from "../../tokenContext";

import "./PageHeader.css";

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

interface SelectOption {
  value: string,
  label: string
}

function PageHeader() {
  const navigate = useNavigate();
  const { ctx_value, ctx_setter } = useContext(TokenContext);

  const [Currencies, SetCurrencies] = useState<FetchedData>();
  const [SelectOptions, SetSelectOptions] = useState<SelectOption[]>();

  useEffect(() => {
    PullCurrencies();
  }, []);

  useEffect(() => {
    SetOptions();
  }, [Currencies]);

  const OnCurrencyChange = (value: string) => {
    ctx_setter(value);
    window.dispatchEvent(new Event('onChange'));

    navigate('/CryptoTracker-v2/info');
  }

  // Pulling Currencies data and saving it using CoinCap API
  const PullCurrencies = async () => {
    const data = await fetch('https://api.coincap.io/v2/assets');
    const json = await data.json();

    SetCurrencies(json);
  }

  // Setting Options for Select Bar in the Header
  const SetOptions = () => {
    const tempOptions: SelectOption[] = [];

    Currencies?.data.forEach((cur) => {
      tempOptions.push( { value: cur.id, label: cur.name } );
    });

    SetSelectOptions(tempOptions);
  }

  return (
    <div className="page_header">
      <a href="/CryptoTracker-v2/"><h4>CryptoTracker</h4></a>
      <Select placeholder={'Select Currency'} onChange={(newValue) => {
        if (newValue) {
          OnCurrencyChange(newValue.value);
        }
        else {
          // in case, if newValue is undefined (i don't know why would that happen, but that scenario is possible),
          // onChange will be called with bitcoin placeholder
          OnCurrencyChange('bitcoin');
        }
      }} className="header_select_bar" options={SelectOptions} />
    </div>
  )
}

export default PageHeader;