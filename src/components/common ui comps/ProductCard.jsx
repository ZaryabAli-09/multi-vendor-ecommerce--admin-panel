// Bro, this can be a 100 million dollar company, code it

import { Link } from "react-router-dom";
import StarRating from "./StarRating";
function ProductCard({ id, image, title, price, rating, numReviews }) {
  // bg-white w-[95%] sm:w-[47%] md:w-[32%] lg:w-[24%] rounded-md p-2 hover:shadow-xl
  return (
    <Link
      to={`/products/${id}`}
      className="bg-white w-60  rounded-md  hover:shadow-xl"
    >
      <div className="h-72">
        <img src={image} alt="" className="w-full h-full object-cover  " />
      </div>

      <div className="flex px-2 pb-2 flex-col gap-1">
        <h2 className="text-sm font-bold mt-4 h-[2.5em] overflow-hidden">
          {title.toUpperCase()}
        </h2>

        <span className="text-lg text-gray-700 font-semibold">
          Price : ${price}
        </span>

        <StarRating rating={rating} numReviews={numReviews} />
      </div>
    </Link>
  );
}

export default ProductCard;
