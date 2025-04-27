// Bro, this can be a 100 million dollar company, code it

// importing icons
import { IoStar } from "react-icons/io5";
import { IoStarHalfOutline } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 > 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex gap-3 items-center">
      <div className="flex text-orange-500">
        {/* displaying full stars if any */}

        {fullStars > 0 && (
          <span className="flex">
            {[...Array(fullStars)].map((_, i) => (
              <IoStar key={i} />
            ))}
          </span>
        )}

        {/* displaying half stars if any */}

        {hasHalfStar && (
          <span>
            <IoStarHalfOutline />
          </span>
        )}

        {/* displaying empty stars if any */}

        {emptyStars > 0 && (
          <span className="flex">
            {[...Array(emptyStars)].map((_, i) => (
              <IoStarOutline key={i} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

export default StarRating;
