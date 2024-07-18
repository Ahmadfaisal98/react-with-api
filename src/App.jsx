/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import './App.css';

const User = ({ user }) => {
  const getName = (user) => {
    if (!user) {
      return 'NO USER!';
    }
    return `${user?.name?.title} ${user?.name?.first} ${user?.name?.last}`;
  };
  return (
    <div className='card'>
      <img src={user?.picture?.thumbnail} alt='picture' />
      <h5>{getName(user)}</h5>
      <div>{user.email}</div>
    </div>
  );
};

const Weather = ({ weather, value, onChange }) => {
  const _weather = weather?.weather ?? [];
  return (
    <div>
      <input type='text' value={value} onChange={onChange} />
      <h5>City: {weather?.name}</h5>
      <h5>Description: {_weather[0]?.description}</h5>
      <h5>Type: {_weather[0]?.main}</h5>
    </div>
  );
};

function App() {
  const [users, setUsers] = useState([]);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');

  const handleOnChange = (event) => {
    const value = event.target.value;
    setCity(value);
  };

  const callApiWeather = async (paramCity = 'Jakarta') => {
    const url = `https://open-weather13.p.rapidapi.com/city/${paramCity}/ID`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_API_KEY_WEATHER,
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setWeather(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timerID = setTimeout(() => {
      if (city) {
        callApiWeather(city);
      }
    }, 300); // 300 milliseconds

    return () => {
      clearTimeout(timerID);
    };
  }, [city]);

  useEffect(() => {
    const asyncFunc = async () => {
      fetch('https://randomuser.me/api?results=5', {
        // API
        method: 'GET',
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUsers(data.results);
        });
    };
    asyncFunc();
    callApiWeather();
  }, []);

  return (
    <div className='app'>
      <div className='container'>
        <h2 className='title'>DATA USERS</h2>
        {users?.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
      <div className='container'>
        <h2 className='title'>DATA WEATHER</h2>
        <Weather weather={weather} value={city} onChange={handleOnChange} />
      </div>
    </div>
  );
}

export default App;
