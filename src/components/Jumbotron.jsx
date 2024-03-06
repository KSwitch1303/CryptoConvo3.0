import React, { useState, useEffect } from "react";

const Jumbotron = () => {
  const [isCallText, setIsCallText] = useState(true);
  const [isFirstText, setIsFirstText] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // State to control visibility

  useEffect(() => {
    const interval = setInterval(() => {
      setIsCallText((prev) => !prev); // Toggle between true and false
      setIsFirstText((prev) => !prev); // Toggle between true and false
    }, 5000); // Change text every 5 seconds

    // Show the content after 500 milliseconds
    setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearInterval(interval);
  }, []); // Run effect only once on component mount

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {isVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
            <div className="text-center md:text-left md:mr-8">
              <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
                {isFirstText ? (
                  <span>
                    Changing the way we{" "}
                    <span className="text-blue-400">call</span>
                  </span>
                ) : (
                  <span>
                    Changing the way we{" "}
                    <span className="text-green-400">reward</span>
                  </span>
                )}
              </h1>
              <p className="max-w-lg mx-auto text-lg md:text-xl text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              {/* Add other texts/animations here */}
            </div>
            <div className="w-full flex justify-end">
              <img
                src={
                  isCallText
                    ? "https://imgur.com/X88jDcJ.jpg"
                    : "https://imgur.com/X88jDcJ.jpg"
                }
                alt="Crypto Convo"
                className="max-w-[50%] md:max-w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jumbotron;
