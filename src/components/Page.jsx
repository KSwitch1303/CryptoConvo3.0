import React from "react";
import Jumbotron from "./Jumbotron";
import Pagenav from "./Pagenav";

const Page = () => {
  return (
    <div>
      <Pagenav />
      <div className="container mx-auto">
        <Jumbotron />
        {/* Add other content here */}
      </div>
    </div>
  );
};

export default Page;
