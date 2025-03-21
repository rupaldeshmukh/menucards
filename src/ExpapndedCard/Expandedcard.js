import React, { useState } from "react";
import "./styles.css";

const Card = ({ id, hovered, setHovered }) => {
  return (
    <div
      className={`card card-${id} ${hovered === id ? "expanded" : ""}`}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
    >
      Card {id}
    </div>
  );
};

const Expandedcard = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="container">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <Card key={id} id={id} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
};

export default Expandedcard;
