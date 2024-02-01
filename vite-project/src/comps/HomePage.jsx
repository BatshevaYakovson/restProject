import React, { useEffect, useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { apiRequestGet, tokenExpireAlert, SERVER_URL } from '../serverConnect/api';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await apiRequestGet(`${SERVER_URL}restaurant/getall`);
        setRestaurants(response.data);
      } catch (error) {
        if (error.response) {
          tokenExpireAlert(error);
        } else {
          console.error(error);
        }
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="home-page container mx-auto mt-8 flex flex-wrap">
      {/* <div className="mb-4">
        <img className="w-full h-96 object-cover" src="https://stock.adobe.com/il/images/vintage-restaurant-logo-restaurant-badge-poster-with-fork-and-knife-vector-emblem-template/275700347" alt="home picture" />
      </div>  */}
      {restaurants.map(restaurant => (
        <div key={restaurant._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
          <RestaurantCard restaurant={restaurant} />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
