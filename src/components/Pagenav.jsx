import React from "react";
import { Link } from "react-router-dom";

const Pagenav = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-white text-xl font-bold">
          Conference App
        </Link>
        <select className="p-2 bg-gray-700 text-white rounded">
          <option>Conference 1</option>
          <option>Conference 2</option>
          <option>Conference 3</option>
        </select>
      </div>
      <div className="space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Join
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Host
        </button>
        <Link to="/page">
          <img
            src="/path/to/image"
            alt="Link to Page Component"
            className="w-10 h-10"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Pagenav;
