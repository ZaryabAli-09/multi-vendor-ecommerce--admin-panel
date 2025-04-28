import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

// Predefined color options (Ensure these match your DB)
const colorOptions = [
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#008000" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
];

// Size options for different categories
const clothingSizes = ["S", "M", "L", "XL", "XXL"];
const shoeSizes = ["6", "7", "8", "9", "10", "11"]; // Common shoe sizes

const ProductEditModal = ({
  editingProductId,
  editPopUp,
  setEditPopUp,
  fetchProducts,
}) => {
  const [allCatgories, setAllCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [variants, setVariants] = useState([
    { size: "", color: "", discountedPrice: 0, stock: 0, price: 0, images: [] },
  ]);
  const [editModaldata, setEditModaldata] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const isFootwear = selectedSubCategory?.name?.toLowerCase() === "footwear";
  const availableSizes = isFootwear ? shoeSizes : clothingSizes;

  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = allCatgories.find((cat) => cat._id === selectedId);
    setSelectedMainCategory(selectedCategory);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
  };

  const handleSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedSubCat = selectedMainCategory.subCategories.find(
      (subCat) => subCat._id === selectedId
    );
    setSelectedSubCategory(selectedSubCat);
    setSelectedSubSubCategory(null);
  };

  const handleSubSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedSubSubCat = selectedSubCategory.subCategories.find(
      (subSubCat) => subSubCat._id === selectedId
    );
    setSelectedSubSubCategory(selectedSubSubCat);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/categories`
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      } else {
        setAllCategories(result.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (editingProductId) {
      fetchSingleProduct(editingProductId);
    }
    fetchCategories();
  }, [editingProductId]);

  const fetchSingleProduct = async (productId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/single/${productId}`
      );
      const result = await res.json();
      if (!res.ok) {
        return new Error(result.message);
      } else {
        setEditModaldata({
          name: result?.data?.name,
          description: result?.data?.description,
        });
        setVariants([...result?.data?.variants]);
        const mainCategory = allCatgories.find(
          (cat) => result.data.categories[0]._id === cat._id
        );
        setSelectedMainCategory(mainCategory);
        setTimeout(() => {
          if (!mainCategory) return;
          const subCategory = mainCategory.subCategories.find(
            (cat) => result.data.categories[1]._id === cat._id
          );
          setSelectedSubCategory(subCategory);
          setTimeout(() => {
            if (!subCategory) return;
            const subSubCategory = subCategory.subCategories.find(
              (cat) => result.data.categories[2]._id === cat._id
            );
            setSelectedSubSubCategory(subSubCategory);
          }, 0);
        }, 0);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (
        !selectedMainCategory ||
        !selectedSubCategory ||
        !selectedSubSubCategory
      ) {
        toast.error("Product categories are required");
        return;
      }
      if (variants.length < 1) {
        toast.error("At least 1 variant is required for a product.");
        return;
      }
      const invalidVariant = variants.some((variant) => {
        return (
          !variant.stock ||
          variant.stock < 0 ||
          variant.discountedPrice < 0 ||
          !variant.price ||
          variant.price <= 0
        );
      });

      if (invalidVariant) {
        toast.error("Invalid inputs in variants.");
        return;
      }

      if (
        !editModaldata ||
        editModaldata.name === "" ||
        editModaldata.description == ""
      ) {
        toast.error("Prodcut name and description is required.");
        return;
      }

      const payload = {
        ...editModaldata,
        variants: variants,
        categories: [
          selectedMainCategory._id,
          selectedSubCategory._id,
          selectedSubSubCategory._id,
        ],
        editingProductId,
      };
      console.log(payload);
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/product/admin/update/${editingProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      } else {
        setLoading(false);
        toast.success(result.message);
        setEditPopUp(!editPopUp);
        fetchProducts();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  return (
    <Dialog
      open={editPopUp}
      onClose={() => setEditPopUp(!editPopUp)}
      fullWidth
      maxWidth="sm"
      className="p-4"
    >
      <DialogTitle className="text-center text-xl font-bold">
        Edit Item
      </DialogTitle>
      <DialogContent className="space-y-4">
        {/* Name Field */}

        <TextField
          label="Name"
          onChange={(e) =>
            setEditModaldata({ ...editModaldata, name: e.target.value })
          }
          value={editModaldata?.name || ""}
          fullWidth
        />

        {/* Categories Section */}
        <div className="space-y-10">
          <FormControl fullWidth>
            <InputLabel>Main Category</InputLabel>
            <Select
              label="Main Category"
              value={selectedMainCategory?._id || ""}
              onChange={handleMainCategoryChange}
            >
              <MenuItem value="">Select a main category</MenuItem>
              {allCatgories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedMainCategory?.subCategories?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                label="Sub Category"
                value={selectedSubCategory?._id || ""}
                onChange={handleSubCategoryChange}
              >
                <MenuItem value="">Select a subcategory</MenuItem>
                {selectedMainCategory.subCategories.map((subCat) => (
                  <MenuItem key={subCat._id} value={subCat._id}>
                    {subCat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedSubCategory?.subCategories?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Sub-Subcategory</InputLabel>
              <Select
                label="Sub-SubCategory"
                value={selectedSubSubCategory?._id || ""}
                onChange={handleSubSubCategoryChange}
              >
                <MenuItem value="">Select a sub-subcategory</MenuItem>
                {selectedSubCategory.subCategories.map((subSubCat) => (
                  <MenuItem key={subSubCat._id} value={subSubCat._id}>
                    {subSubCat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>

        {/* Description Field */}
        <TextField
          label="Description"
          multiline
          rows={3}
          onChange={(e) =>
            setEditModaldata({
              ...editModaldata,
              description: e.target.value,
            })
          }
          value={editModaldata?.description || ""}
          fullWidth
        />

        {/* Variants Section */}
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg flex flex-col gap-4 shadow-sm"
            >
              <div className="flex space-x-1">
                {variant?.images.map((img) => {
                  return (
                    <img
                      className="w-12 h-auto object-cover"
                      src={img.url}
                      alt="product variant image"
                    />
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Size Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    disabled
                    label="Size"
                    value={variant.size}
                    onChange={(e) =>
                      handleChange(index, "size", e.target.value)
                    }
                  >
                    {availableSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Color Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    label="Color"
                    disabled
                    value={variant.color}
                    onChange={(e) =>
                      handleChange(index, "color", e.target.value)
                    }
                  >
                    {colorOptions.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <span
                            className="w-4 h-4 rounded-full inline-block mr-2"
                            style={{ backgroundColor: color.value }}
                          ></span>
                          {color.name}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextField
                  label="Price"
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Discounted Price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={variant.discountedPrice}
                  onChange={(e) =>
                    handleChange(index, "discountedPrice", e.target.value)
                  }
                />
                <TextField
                  label="Stock"
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleChange(index, "stock", e.target.value)}
                  fullWidth
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>

      {/* Actions */}
      <DialogActions className="flex justify-between p-4">
        <Button
          onClick={() => setEditPopUp(!editPopUp)}
          variant="contained"
          size="small"
          color="error"
        >
          Cancel
        </Button>
        <Button
          size="small"
          onClick={handleSubmitEdit}
          variant="contained"
          color="success"
        >
          {loading ? <CircularProgress size={24} /> : "Save"}{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditModal;
