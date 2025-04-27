import React, { useState } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, onColorChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [filteredColors, setFilteredColors] = useState([
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FFFF33",
    "#FF33FF",
    "#33FFFF", // Add more predefined colors here
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleColorChange = (color) => {
    onColorChange(color.hex); // Return selected color
    setShowColorPicker(false); // Close picker after selection
  };

  const handleFilterColors = (e) => {
    setSearchTerm(e.target.value);
    setFilteredColors((prevColors) =>
      prevColors.filter((color) =>
        color.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        style={{ padding: "10px", backgroundColor: color }}
      >
        Select Color
      </button>

      {showColorPicker && (
        <div style={{ position: "absolute", zIndex: 1 }}>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              marginTop: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Filter colors"
              value={searchTerm}
              onChange={handleFilterColors}
              style={{
                padding: "8px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", padding: "8px" }}>
              {filteredColors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorChange({ hex: color })}
                  style={{
                    backgroundColor: color,
                    width: "30px",
                    height: "30px",
                    margin: "5px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>
          <SketchPicker
            color={color}
            onChangeComplete={(color) => handleColorChange(color)}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
