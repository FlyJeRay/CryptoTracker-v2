import React from "react";

import "./Footer.css"

function Footer() {
  return (
    <div className="footer_block">
      <a href='https://github.com/FlyJeRay/CryptoTracker-v2'>
        <p>Source Code</p>
      </a>
      <p>
        CoinCap API <a href='https://docs.coincap.io'>documentation</a>
      </p>
    </div>
  )
}

export default Footer;