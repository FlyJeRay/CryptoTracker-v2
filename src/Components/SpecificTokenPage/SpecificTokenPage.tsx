import React from "react";

import "./SpecificTokenPage.css"

function SpecificTokenPage() {
  const url = window.location.pathname;
  console.log(url);

  return(
    <div>
      <h4 className="specific_page_title">Specific Token Page</h4>
    </div>
  )
}

export default SpecificTokenPage;