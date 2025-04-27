import { useState } from "react";

function Product() {
  const product = {
    _id: "67ae3816104f4c0debc1b13d",
    seller: "674a1d35b7c4360c86e36baa",
    name: "t shirt",
    description: "jgjhgjhghgjhgj",
    slug: "t-shirt",
    numReviews: 0,
    sold: 0,
    rating: 0,
    countInStock: 29,
    categories: [
      "6719565189598c10e7a7dfde",
      "671956aa29acfa9cf833d398",
      "6719578629acfa9cf833d3ac",
    ],
    reviews: [],
    variants: [
      {
        _id: "67ae3816104f4c0debc1b13e",
        size: "M",
        color: "#FF0000",
        price: 1000,
        discountedPrice: null,
        stock: 5,
        images: [
          {
            url: "https://res.cloudinary.com/dv4utklyo/image/upload/v1739471378/product-images/l3dbaaj5g1muaoli491g.jpg",
            public_id: "product-images/cjqrwuqelhtl6zjjp8g5",
            _id: "67ae3816104f4c0debc1b13f",
          },
        ],
      },
      {
        _id: "67ae3816104f4c0debc1b140",
        size: "S",
        color: "#FF0000",
        price: 900,
        discountedPrice: null,
        stock: 8,
        images: [
          {
            url: "https://res.cloudinary.com/dv4utklyo/image/upload/v1739471378/product-images/l3dbaaj5g1muaoli491g.jpg",
            public_id: "product-images/cjqrwuqelhtl6zjjp8g5",
            _id: "67ae3816104f4c0debc1b141",
          },
        ],
      },
      {
        _id: "67ae3816104f4c0debc1b142",
        size: "M",
        color: "#0000FF",
        price: 2000,
        discountedPrice: null,
        stock: 10,
        images: [
          {
            url: "https://res.cloudinary.com/dv4utklyo/image/upload/v1739471379/product-images/prczshs83mdlscwuibtu.jpg",
            public_id: "product-images/vyzagud5nift3c2sdif1",
            _id: "67ae3816104f4c0debc1b143",
          },
        ],
      },
      {
        _id: "67ae3816104f4c0debc1b144",
        size: "S",
        color: "#0000FF",
        price: 1990,
        discountedPrice: null,
        stock: 15,
        images: [
          {
            url: "https://res.cloudinary.com/dv4utklyo/image/upload/v1739471379/product-images/prczshs83mdlscwuibtu.jpg",
            public_id: "product-images/vyzagud5nift3c2sdif1",
            _id: "67ae3816104f4c0debc1b145",
          },
        ],
      },
    ],
    createdAt: "2025-02-13T18:21:10.108Z",
    updatedAt: "2025-02-13T18:21:10.108Z",
    __v: 0,
  };
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);

  // Filter variants based on selected color
  const colorVariants = product.variants.filter(
    (v) => v.color === selectedColor
  );

  // Find the variant matching both color & size
  const selectedVariant =
    colorVariants.find((v) => v.size === selectedSize) || colorVariants[0];

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>

      {/* Display Images */}
      <div className="mt-4">
        <img
          src={selectedVariant.images[0].url}
          alt="Product"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Color Selection */}
      <div className="mt-4 flex gap-2">
        {Array.from(new Set(product?.variants.map((v) => v.color))).map(
          (color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border ${
                selectedColor === color ? "ring-2 ring-black" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          )
        )}
      </div>

      {/* Size Selection */}
      <div className="mt-4">
        <label className="font-semibold">Size: </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="ml-2 border p-1 rounded"
        >
          {colorVariants.map((variant) => (
            <option key={variant.size} value={variant.size}>
              {variant.size}
            </option>
          ))}
        </select>
      </div>

      {/* Price & Stock */}
      <div className="mt-4">
        <p className="text-lg font-semibold">
          Price:
          {selectedVariant.discountedPrice ? (
            <>
              <span className="line-through text-gray-500 ml-2">
                ${selectedVariant.price}
              </span>
              <span className="text-red-500 ml-2">
                ${selectedVariant.discountedPrice}
              </span>
            </>
          ) : (
            <span className="ml-2">${selectedVariant.price}</span>
          )}
        </p>
        <p className="text-sm text-gray-600">
          Stock: {selectedVariant.stock} left
        </p>
      </div>
    </div>
  );
}

export default Product;
