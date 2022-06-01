import React, { useEffect, useState } from "react";
import Select from "react-select";

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
  const [Currencies, SetCurrencies] = useState<FetchedData>();
  const [SelectOptions, SetSelectOptions] = useState<SelectOption[]>();

  useEffect(() => {
    PullCurrencies();
  }, []);

  useEffect(() => {
    SetOptions();
  }, [Currencies]);

  const OnCurrencyChange = (value: string) => {
    window.location.href = `/info_${value}`;
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
      <a href="/"><h4>CryptoTracker</h4></a>
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