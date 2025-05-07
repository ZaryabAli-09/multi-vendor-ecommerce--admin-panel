import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [displayedImgIndex, setDisplayedImgIndex] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/product/single/${productId}`
        );
        const result = await response.json();
        if (response.ok) {
          setProduct(result.data);
          setSelectedVariant(result.data.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleVariantChange = (type, value) => {
    const newVariant = product.variants.find((v) =>
      type === "color"
        ? v.color === value
        : v.size === value && v.color === selectedVariant.color
    );
    if (newVariant) {
      setSelectedVariant(newVariant);
      setDisplayedImgIndex(0); // Reset to first image when variant changes
    }
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <button
        className="absolute top-3 left-5 border p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition duration-200"
        onClick={() => window.history.back()}
        variant="standard"
      >
        Go Back
      </button>
      <nav className="text-sm text-gray-600 mb-6 mt-5">
        {product.categories.map((cat, i) => (
          <span key={cat._id}>
            {i > 0 && " / "}
            {cat.name}
          </span>
        ))}
      </nav>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images - Mobile First */}
        <div className="w-full lg:w-1/2">
          {/* Main Image */}
          <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={selectedVariant.images[displayedImgIndex]?.url}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {selectedVariant.images.map((img, i) => (
              <button
                key={img._id}
                onClick={() => setDisplayedImgIndex(i)}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                  displayedImgIndex === i
                    ? "border-black"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl md:text-3xl text-orange-500 font-semibold">
              Rs {selectedVariant.discountedPrice || selectedVariant.price}
            </span>
            {selectedVariant.discountedPrice && (
              <span className="text-lg text-gray-500 line-through">
                Rs {selectedVariant.price}
              </span>
            )}
          </div>

          <div className="border-b border-gray-200 my-6"></div>

          {/* Variant Selection */}
          <div className="space-y-6">
            {/* Color Selection */}
            <div>
              <h3 className="font-medium mb-2">
                Color: {selectedVariant.color}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(product.variants.map((v) => v.color))].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => handleVariantChange("color", color)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        color === selectedVariant.color
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full block"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === "#ffffff"
                              ? "#f3f4f6"
                              : color,
                        }}
                      />
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-medium mb-2">
                Size:{" "}
                {selectedVariant.size === "S"
                  ? "Small"
                  : selectedVariant.size === "M"
                  ? "Medium"
                  : selectedVariant.size === "L"
                  ? "Large"
                  : selectedVariant.size === "XL"
                  ? "Extra Large"
                  : selectedVariant.size}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants
                  .filter((v) => v.color === selectedVariant.color)
                  .map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => handleVariantChange("size", variant.size)}
                      className={`px-4 py-2 rounded-md border ${
                        variant.size === selectedVariant.size
                          ? "border-black bg-gray-100 font-medium"
                          : "border-gray-200"
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
