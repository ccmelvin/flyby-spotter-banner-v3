 <!-- const [currentWeather] = useState<WeatherData>(weatherData);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sunny":
        return <Sun className="size-7 text-yellow-50" />;
      case "partly_cloudy_day":
        return <CloudSun className="size-7 text-yellow-50" />;
      case "cloud":
        return <Cloud className="size-7 text-yellow-50" />;
      case "rainy":
        return <CloudRain className="size-7 text-yellow-50" />;
      default:
        return <Sun className="size-7 text-yellow-50" />;
    }
  };
  const getTimeZone = () => {
    return `${timeZone === "east" ? "eastern" : "western"}`;
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setShowTemperature((prev) => !prev);
    }, 5000); // Switch every 5 seconds
    return () => clearInterval(interval);
  }, []);


  // Inside your component
  const [showTemperature, setShowTemperature] = useState(true); -->

 
 <!-- <div className=" flex items-center justify-center border-r border-amber-400 pr-3 md:pr-5">
                  {/* Temperature Section */}
                  <div
                    className={` transition-all duration-200 ease-in-out ${
                      showTemperature
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 absolute"
                    }`}
                  >
                    <div className="text-[20px] px-2 text-yellow-50 mb-0">
                      {getWeatherIcon(currentWeather.icon)}
                    </div>

                    <div className="text-[20px] font-bold text-yellow-50 mb-0">
                      {Math.round((temperature * 9) / 5 + 32)}°
                      <span className="text-[20px]">F</span>
                    </div>
                  </div>

                  {/* Time Section */}
                  <div
                    className={`flex flex-col items-center px-4 transition-all duration-200 ease-in-out ${
                      !showTemperature
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 absolute"
                    }`}
                  >
                    <div className="text-[16px] text-yellow-50 mb-0">
                      <span className="text-[20px] font-bold">12:00pm</span>
                    </div>
                    <div className="flex items-center text-yellow-50">
                      {getTimeZone()}
                    </div>
                  </div>
                </div> -->