import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Jumbotron = () => {
  const [isCallText, setIsCallText] = useState(true);
  const [isFirstText, setIsFirstText] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // State to control visibility
  const navigate = useNavigate();

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
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-12 md:py-20 min-h-screen">
      <div className="container mx-auto px-4">
        {isVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
            <div className="text-center md:text-left md:mr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
                {isFirstText ? (
                  <span>
                    Changing the way we{" "}
                    <span className="text-blue-400 block text-center md:inline-block md:ml-0 md:pl-2">
                      call
                    </span>
                  </span>
                ) : (
                  <span>
                    Changing the way we{" "}
                    <span className="text-green-400 block text-center md:inline-block md:ml-0 md:pl-2">
                      reward
                    </span>
                  </span>
                )}{" "}
              </h1>
              <p className="max-w-lg mx-auto text-lg md:text-base font-semibold lg:text-xl text-gray-200 mb-6">
                Empowering seamless, conferencing with POAP Cnfts - Turning
                every call into a rewarding experience.
              </p>
              <button
                className="shadow-lg shadow-indigo-500/50 relative flex items-center justify-center text-white hover:before:bg-purple-500 h-[50px] md:w-60 w-full overflow-hidden border border-gray-700 bg-transparent px-3 text-purple-500 shadow-2xl transition-all rounded-md before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-purple-500 before:transition-all before:duration-500 hover:text-white hover:shadow-purple-lg hover:before:left-0 hover:before:w-full"
                style={{ margin: "auto" }}
                onClick={() => navigate("/create")}
              >
                <span className="relative z-10 text-sm md:text-base font-semibold">
                  Start Your Journey
                </span>
              </button>
            </div>
            <div className="w-full flex justify-center md:justify-end">
              <img
                src={
                  isCallText
                    ? "https://imgur.com/X88jDcJ.jpg"
                    : "https://imgur.com/X88jDcJ.jpg"
                }
                alt="Crypto Convo"
                className="max-w-[70%] md:max-w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jumbotron;
