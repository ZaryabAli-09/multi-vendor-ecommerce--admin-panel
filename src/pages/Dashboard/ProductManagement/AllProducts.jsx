import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Skeleton,
  TextField,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductEditModal from "../../../components/Product/ProductEditModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllProducts = () => {
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPopUp, setEditPopUp] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    minSold: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const limit = 10; // Products per page

  const fetchProducts = async (page, filters = {}) => {
    try {
      setIsFetching(true);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/product/all-filter-pagination?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      } else {
        setProducts(result.data.data);
        setTotalPages(Math.ceil(result.data.total / limit)); // Calculate total pages
        console.log(result.data.total, limit);
        console.log(totalPages);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setDeletingProductId(productId);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/admin/delete/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      } else {
        setProducts(products.filter((product) => product._id !== productId));
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleEdit = async (productId) => {
    setEditPopUp(true);
    setEditingProductId(productId);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to the first page when applying filters
    fetchProducts(1, filters); // Fetch all products matching filters
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      name: "",
      minPrice: "",
      maxPrice: "",
      minSold: "",
    });
    setCurrentPage(1); // Reset to the first page
    fetchProducts(1); // Fetch products without filters
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchProducts(page); // Fetch products for the selected page
  };

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage]);

  return (
    <>
      {/* Sticky Filter Section */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          padding: 2,
          boxShadow: 3,
          marginBottom: 4,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Filters
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Product Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            size="small"
          />
          <TextField
            label="Min Price"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            type="number"
            size="small"
          />
          <TextField
            label="Max Price"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            type="number"
            size="small"
          />
          <TextField
            label="Min Sold"
            name="minSold"
            value={filters.minSold}
            onChange={handleFilterChange}
            type="number"
            size="small"
          />
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>

      <TableContainer className="p-4" component={Paper}>
        <h2 className="text-xl md:text-2xl mb-6">Manage Products</h2>

        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              // Skeleton Loading
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={48} height={48} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={100} height={30} />
                  </TableCell>
                </TableRow>
              ))
            ) : !products || products.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={product.variants?.[0].images[0].url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/dashboard/product/${product._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product?.seller?.brandName}</TableCell>

                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>
                    {product.categories.map((category) => (
                      <div key={category._id} className="text-xs">
                        {category.name}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>${product?.variants[0]?.price}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell className="md:flex md:space-x-1 space-y-1 md:space-y-0">
                    <Button
                      onClick={() => handleEdit(product._id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      <FaEdit className="text-xl" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      variant="contained"
                      size="small"
                      color="error"
                      disabled={deletingProductId === product._id}
                    >
                      {deletingProductId === product._id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <FaTrash className="text-xl" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!isFetching && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Edit Product Modal */}
      <ProductEditModal
        editPopUp={editPopUp}
        setEditPopUp={setEditPopUp}
        fetchProducts={fetchProducts}
        editingProductId={editingProductId}
      />
    </>
  );
};

export default AllProducts;
