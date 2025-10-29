import React from 'react';
import './DishCard.css';

const DishCard = ({ dish }) => {
  return (
    <div className="dish-card">
      <div className="dish-image">
        <img src={dish.image} alt={dish.dishName} onError={(e) => 
        (e.target.src = '/placeholder.jpg')} />
      </div>
      <div className="dish-details">
        <p>Name: {dish.dishName}</p>
        <p>Description: {dish.description}</p>
        <p>Price: ₹{dish.dishPrice}</p>
        <p>Average Prep Time: {dish.dishPrepTime} mins</p>
        <p>Category: {dish.dishCategory}</p>
      </div>
    </div>
  );
};

export default DishCard;
