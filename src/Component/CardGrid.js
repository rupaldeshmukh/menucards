import React, { useState } from "react";
import "./CardGrid.css";

const CardGrid = () => {
  const cards = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: `This is the full description of Card ${i + 1}. It contains more details about the content and purpose of this card.`,
  }));

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <div key={card.id} className="card">
          <div className="face1">
            <h3 className="card-title">{card.title}</h3>
            <div className="face2">
            <p className="card-description">
              {card.description.slice(0, 60)}...
            </p>
            <div className="card-footer">
              <button>Read More</button>
            </div>
          </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
