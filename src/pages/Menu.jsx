import React, { useEffect, useState } from 'react';
import DishCard from '../pages/DishCard';
import './Menu.css';

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/dishes`);
        if (!response.ok) throw new Error('Failed to fetch menu');
        const data = await response.json();
        setDishes(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDishes();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!dishes.length) return <p className="loading-message">Loading menu...</p>;

  return (
    <div className="menu-container">
      <div className="menu-grid">
        {dishes.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
