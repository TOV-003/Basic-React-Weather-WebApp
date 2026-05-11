/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';

const WeatherApp = () => {
  const [city, setCity] = useState('Amsterdam');
  const [newCity, setNewCity] = useState('');
  const [unit, setUnit] = useState('Celsius');

  const [weatherData, setWeatherData] = useState({
    temp: null,
    tempFah: null,
    tempKel: null,
    humidity: null,
    windSpeed: null,
    pressure: null,
    visibility: null,
  });

  const calculateFahrenheitAndKelvin = (tempCelsius) => {
    const fah = (tempCelsius * 9) / 5 + 32;
    const kel = tempCelsius + 273.15;

    return { fah, kel };
  };

  const fetchWeather = useCallback(async (searchCity) => {
    if (!searchCity) return;

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=aa276fbd616d47a9b2482011261701&q=${searchCity}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const { fah, kel } = calculateFahrenheitAndKelvin(
        data.current.temp_c
      );

      setWeatherData({
        temp: data.current.temp_c,
        tempFah: fah,
        tempKel: kel,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
      });

      setCity(searchCity);
      setNewCity('');
    } catch (error) {
      alert('Error: No API response!');
      console.error('Fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchWeather('Amsterdam');
  }, [fetchWeather]);

  const handleSearch = () => {
    const target = newCity || city;
    fetchWeather(target);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getDisplayTemp = () => {
    if (weatherData.temp === null) return '';

    if (unit === 'Celsius') {
      return weatherData.temp.toFixed(1);
    }

    if (unit === 'Fahrenheit') {
      return weatherData.tempFah?.toFixed(1);
    }

    return weatherData.tempKel?.toFixed(1);
  };

  const getUnitSymbol = () => {
    if (unit === 'Celsius') return '°C';
    if (unit === 'Fahrenheit') return '°F';

    return 'K';
  };

  return (
    <div className="min-h-screen bg-[#1B1D23] text-[#E8EAF0] flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10">

      {/* Search */}
      <div className="w-full max-w-3xl flex items-center gap-3 sm:gap-4 bg-[#252932] border border-[#343944] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg">
        <input
          type="text"
          placeholder="Search city..."
          className="bg-transparent outline-none w-full text-lg sm:text-xl md:text-2xl text-[#F5F7FA] placeholder:text-[#7B8190]"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={handleSearch}
          className="bg-[#3B82F6] hover:bg-[#2563EB] transition-colors p-3 rounded-xl shrink-0"
        >
          <img
            src="/search.svg"
            alt="search"
            className="w-5 sm:w-6"
          />
        </button>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mt-10 w-full max-w-5xl bg-[#252932] border border-[#343944] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl flex flex-col items-center gap-6 sm:gap-8">

        {/* Temperature */}
        <div className="text-center w-full">
          <p className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[15rem] font-bold leading-none tracking-tight break-words">
            {getDisplayTemp()}
            <span className="font-light text-[#8D93A1]">
              {getUnitSymbol()}
            </span>
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {['Celsius', 'Fahrenheit', 'Kelvin'].map((tempUnit) => (
              <button
                key={tempUnit}
                onClick={() => setUnit(tempUnit)}
                className={`px-4 sm:px-5 py-2 rounded-xl border text-sm sm:text-base transition-all duration-200 ${
                  unit === tempUnit
                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                    : 'bg-[#1E222B] border-[#343944] text-[#AAB1BF] hover:bg-[#2B313D]'
                }`}
              >
                {tempUnit}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div className="text-center">
          <p className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight break-words">
            {city}
          </p>

          <p className="text-sm sm:text-base text-[#7B8190] mt-2">
            Current Weather Conditions
          </p>
        </div>

        <div className="w-full h-px bg-[#343944]" />

        {/* Weather Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">

          <div className="bg-[#1E222B] border border-[#343944] rounded-2xl p-5 sm:p-6">
            <p className="text-[#7B8190] text-xs sm:text-sm uppercase tracking-widest">
              Humidity
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              {weatherData.humidity}%
            </h2>
          </div>

          <div className="bg-[#1E222B] border border-[#343944] rounded-2xl p-5 sm:p-6">
            <p className="text-[#7B8190] text-xs sm:text-sm uppercase tracking-widest">
              Pressure
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              {weatherData.pressure} mb
            </h2>
          </div>

          <div className="bg-[#1E222B] border border-[#343944] rounded-2xl p-5 sm:p-6">
            <p className="text-[#7B8190] text-xs sm:text-sm uppercase tracking-widest">
              Visibility
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              {weatherData.visibility} km
            </h2>
          </div>

          <div className="bg-[#1E222B] border border-[#343944] rounded-2xl p-5 sm:p-6">
            <p className="text-[#7B8190] text-xs sm:text-sm uppercase tracking-widest">
              Wind Speed
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              {weatherData.windSpeed} km/h
            </h2>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 sm:mt-10 text-center text-[#7B8190] text-sm space-y-2 px-4">
        <h1 className="text-base sm:text-lg text-[#D7DBE5]">
          Weather dashboard built with React and WeatherAPI
        </h1>

        <p className="break-words">
          Weather data provided by{' '}
          <a
            href="https://www.weatherapi.com/"
            target="_blank"
            rel="noopener"
            className="text-[#60A5FA] hover:underline"
          >
            weatherapi.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default WeatherApp;