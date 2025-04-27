// Bro, this can be a 100 million dollar company, code it

// importing hooks
import { useEffect, useState } from "react";

// importing icons
import { FaCircle } from "react-icons/fa";

function ProductSlider({ sliderImgs }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // This code makes the slider auto-scroll every 10 seconds.
  // By passing currentImgIndex in the dependency array, the useEffect hook re-runs every time currentImgIndex changes (either due to the setTimeout after 10s or when the user clicks the previous/next buttons). This ensures that the setTimeout resets and runs again after each image change.

  useEffect(() => {
    const intervalId = setTimeout(() => {
      setCurrentImgIndex((prevImgIndex) => {
        return prevImgIndex + 1 === sliderImgs.length ? 0 : prevImgIndex + 1;
      });
    }, 3000);

    return () => clearTimeout(intervalId);
  }, [currentImgIndex]);

  return (
    /* The below div renders each image in the slider */
    /* Images are styled as background images and positioned side by side horizontally. */
    /* The transform property is used to shift the visible image by updating the translateX value, creating the sliding effect. */
    /* The transition-transform property ensures the sliding animation happens smoothly over 300ms. */

    <div className="flex flex-row flex-nowrap w-[100%] aspect-[8/7]  relative overflow-hidden ">
      {sliderImgs.map((img, i) => {
        return (
          <div
            className="w-[100%] h-[100%] flex-shrink-0 bg-contain bg-no-repeat bg-center o transition-transform duration-700"
            key={i}
            style={{
              backgroundImage: `url(${img})`,
              transform: `translateX(${-100 * currentImgIndex}%)`, // Move to the correct image based on currentImgIndex
            }}
          ></div>
        );
      })}

      {/* Previous button to navigate to the previous image */}
      {/* It updates the currentImgIndex by decreasing it. If the current image is the first one, it loops back to the last image. */}

      {/* This div contains the navigation dots, which indicate the current image in the slider. */}
      {/* The number of dots corresponds to the number of images. */}
      {/* The currently active image is highlighted by changing the color of the corresponding dot. */}

      <div className="flex gap-2 absolute bottom-[5%] left-[50%] translate-x-[-50%]">
        {sliderImgs.map((_, i) => (
          <FaCircle
            key={i}
            className={`cursor-pointer text-[10px] md:text-sm ${
              i === currentImgIndex ? "text-rose-50" : "text-gray-300"
            }`}
            onClick={() => setCurrentImgIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductSlider;
