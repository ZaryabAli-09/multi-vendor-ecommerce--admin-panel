import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AddCategories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showAddInput, setShowAddInput] = useState({
    main: false,
    sub: false,
    subSub: false,
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/categories`
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setAllCategories(result.data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  console.log(allCategories);
  const handleCategoryChange = (e, level) => {
    const selectedId = e.target.value;
    let selectedCategory;

    if (level === "main") {
      selectedCategory = allCategories.find((cat) => cat._id === selectedId);
      setSelectedMainCategory(selectedCategory);
      setSelectedSubCategory(null);
      setShowAddInput({ main: false, sub: false, subSub: false });
    } else if (level === "sub") {
      selectedCategory = selectedMainCategory.subCategories.find(
        (subCat) => subCat._id === selectedId
      );
      setSelectedSubCategory(selectedCategory);
      setShowAddInput((prev) => ({ ...prev, sub: false, subSub: false }));
    }
  };

  const handleAddNewCategory = async (level) => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const parentId =
        level === "main"
          ? null
          : level === "sub"
          ? selectedMainCategory?._id
          : selectedSubCategory?._id;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/create-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: newCategoryName,
            parent: parentId,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(result.message);
      setNewCategoryName("");
      setShowAddInput({ main: false, sub: false, subSub: false });
      fetchCategories(); // Refresh the categories
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box className="p-8 m-4 w-[90%] mx-auto border bg-white shadow-lg rounded-md">
      <h2 className="text-xl md:text-2xl mb-4 text-dark">Add Categories</h2>

      <div className="flex flex-col-reverse md:flex-row md:justify-between">
        <div className="md:w-[50%]">
          {/* Main Category Selection */}
          <div className="mb-4">
            <FormControl fullWidth>
              <InputLabel>Main Category</InputLabel>
              <Select
                value={selectedMainCategory?._id || ""}
                onChange={(e) => handleCategoryChange(e, "main")}
                label="Main Category"
                required
              >
                <MenuItem value="">Select Main Category</MenuItem>
                {allCategories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedMainCategory && (
              <div className="mt-2">
                <Button
                  variant="outlined"
                  onClick={() =>
                    setShowAddInput({ main: false, sub: true, subSub: false })
                  }
                >
                  Add Subcategory to {selectedMainCategory.name}
                </Button>
              </div>
            )}
            {showAddInput.sub && (
              <div className="mt-2 flex gap-2">
                <TextField
                  fullWidth
                  label={`New subcategory for ${selectedMainCategory?.name}`}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddNewCategory("sub")}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Subcategory Selection */}
          {selectedMainCategory &&
            selectedMainCategory.subCategories?.length > 0 && (
              <div className="mb-4">
                <FormControl fullWidth>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={selectedSubCategory?._id || ""}
                    onChange={(e) => handleCategoryChange(e, "sub")}
                    label="Subcategory"
                    required
                  >
                    <MenuItem value="">Select Subcategory</MenuItem>
                    {selectedMainCategory.subCategories.map((subCat) => (
                      <MenuItem key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedSubCategory && (
                  <div className="mt-2">
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setShowAddInput({
                          main: false,
                          sub: false,
                          subSub: true,
                        })
                      }
                    >
                      Add Sub-Subcategory to {selectedSubCategory.name}
                    </Button>
                  </div>
                )}
                {showAddInput.subSub && (
                  <div className="mt-2 flex gap-2">
                    <TextField
                      fullWidth
                      label={`New sub-subcategory for ${selectedSubCategory?.name}`}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAddNewCategory("subSub")}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </Box>
  );
};

export default AddCategories;
