import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Chip,
  Typography,
  Divider,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  CheckCircleOutline,
  PendingActions,
  Block,
  Cancel,
  Store,
  Email,
  Phone,
  Home,
  AccountBalance,
  Instagram,
  Facebook,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";

const BrandsManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    brandName: "",
    contactNumber: "",
    brandDescription: "",
    businessAddress: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    },
    bankDetails: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
    },
    status: "",
  });

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/seller/all?page=${page}&search=${searchTerm}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSellers(data.data.sellers);
        setTotalPages(data.data.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [page, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleOpenEditDialog = (seller) => {
    setSelectedSeller(seller);
    setEditData({
      brandName: seller.brandName,
      contactNumber: seller.contactNumber,
      brandDescription: seller.brandDescription,
      businessAddress: seller.businessAddress,
      socialLinks: {
        instagram: seller.socialLinks?.instagram || "",
        facebook: seller.socialLinks?.facebook || "",
        twitter: seller.socialLinks?.twitter || "",
        linkedin: seller.socialLinks?.linkedin || "",
      },
      bankDetails: {
        bankName: seller.bankDetails?.bankName || "",
        accountNumber: seller.bankDetails?.accountNumber || "",
        accountHolderName: seller.bankDetails?.accountHolderName || "",
      },
      status: seller.status,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedSeller(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateSeller = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/admin/update/${
          selectedSeller._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Seller updated successfully");
        fetchSellers();
        handleCloseEditDialog();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update seller");
    }
  };

  const handleViewDetails = async (sellerId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/details/${sellerId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSellerDetails(data.data.seller);
        setTopProducts(data.data.topProducts);
        setRecentProducts(data.data.recentProducts);
        setTotalProducts(data.data.totalProducts);
        setDetailDialogOpen(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch seller details");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleOutline color="success" />;
      case "pending":
        return <PendingActions color="warning" />;
      case "rejected":
        return <Cancel color="error" />;
      case "blocked":
        return <Block color="error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      case "blocked":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Brands Management</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <TextField
          fullWidth
          variant="outlined"
          label="Search by brand name"
          value={searchTerm}
          onChange={handleSearch}
          className="bg-white"
          InputProps={{
            startAdornment: (
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            ),
          }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <>
          {/* Sellers Table */}
          <TableContainer
            component={Paper}
            className="shadow-lg rounded-lg overflow-hidden mb-6"
          >
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell className="font-bold">Brand</TableCell>
                  <TableCell className="font-bold">Contact</TableCell>
                  <TableCell className="font-bold">Status</TableCell>
                  <TableCell className="font-bold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sellers.map((seller) => (
                  <TableRow key={seller._id} hover className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={seller.logo?.url || "/placeholder-logo.jpg"}
                          alt={seller.brandName}
                          sx={{ width: 40, height: 40 }}
                        />
                        <div>
                          <div className="font-medium">{seller.brandName}</div>
                          <div className="text-sm text-gray-500">
                            {seller.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{seller.contactNumber}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(seller.status)}
                        label={seller.status}
                        color={getStatusColor(seller.status)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(seller._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenEditDialog(seller)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </div>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Brand: {selectedSeller?.brandName}</DialogTitle>
        <DialogContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Brand Name"
              name="brandName"
              value={editData.brandName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={editData.contactNumber}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Business Address"
              name="businessAddress"
              value={editData.businessAddress}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={editData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Instagram"
                name="socialLinks.instagram"
                value={editData.socialLinks.instagram}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Facebook"
                name="socialLinks.facebook"
                value={editData.socialLinks.facebook}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Twitter"
                name="socialLinks.twitter"
                value={editData.socialLinks.twitter}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="LinkedIn"
                name="socialLinks.linkedin"
                value={editData.socialLinks.linkedin}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Bank Name"
                name="bankDetails.bankName"
                value={editData.bankDetails.bankName}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Account Number"
                name="bankDetails.accountNumber"
                value={editData.bankDetails.accountNumber}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Account Holder Name"
                name="bankDetails.accountHolderName"
                value={editData.bankDetails.accountHolderName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <TextField
              fullWidth
              label="Brand Description"
              name="brandDescription"
              value={editData.brandDescription}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </div>
        </DialogContent>
        <DialogActions className="bg-gray-50 px-6 py-4">
          <Button onClick={handleCloseEditDialog} className="text-gray-600">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSeller}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Brand Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {sellerDetails && (
          <>
            <DialogTitle className="bg-gray-100">
              <div className="flex items-center space-x-2">
                <Store />
                <span>{sellerDetails.brandName}</span>
                <Chip
                  label={`${totalProducts} products`}
                  color="primary"
                  size="small"
                  className="ml-2"
                />
              </div>
            </DialogTitle>
            <DialogContent className="pt-6">
              <Grid container spacing={3}>
                {/* Brand Info Column */}
                <Grid item xs={12} md={4}>
                  <Card className="shadow-md rounded-lg">
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        sellerDetails.coverImage?.url ||
                        "https://placehold.co/600x400?text=No+Cover+Image"
                      }
                      alt="Cover"
                      className="object-cover"
                    />
                    <CardContent className="text-center">
                      <Avatar
                        src={sellerDetails.logo?.url || "/placeholder-logo.jpg"}
                        alt="Logo"
                        sx={{
                          width: 80,
                          height: 80,
                          margin: "-40px auto 10px",
                          border: "4px solid white",
                        }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {sellerDetails.brandName}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(sellerDetails.status)}
                        label={sellerDetails.status}
                        color={getStatusColor(sellerDetails.status)}
                        sx={{ mb: 2 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {sellerDetails.brandDescription ||
                          "No description provided"}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="subtitle2" gutterBottom>
                          <Email
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {sellerDetails.email}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          <Phone
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {sellerDetails.contactNumber || "N/A"}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          <Home
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />
                          {sellerDetails.businessAddress || "N/A"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Bank Details */}
                  <Card className="shadow-md rounded-lg mt-4">
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        className="flex items-center"
                      >
                        <AccountBalance sx={{ mr: 1 }} />
                        Bank Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" gutterBottom>
                        <strong>Bank:</strong>{" "}
                        {sellerDetails.bankDetails?.bankName || "N/A"}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Account #:</strong>{" "}
                        {sellerDetails.bankDetails?.accountNumber || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Holder:</strong>{" "}
                        {sellerDetails.bankDetails?.accountHolderName || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  <Card className="shadow-md rounded-lg mt-4">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Social Links
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <div className="flex space-x-2">
                        {sellerDetails.socialLinks?.instagram && (
                          <a
                            href={sellerDetails.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Instagram color="primary" />
                          </a>
                        )}
                        {sellerDetails.socialLinks?.facebook && (
                          <a
                            href={sellerDetails.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Facebook color="primary" />
                          </a>
                        )}
                        {sellerDetails.socialLinks?.twitter && (
                          <a
                            href={sellerDetails.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter color="primary" />
                          </a>
                        )}
                        {sellerDetails.socialLinks?.linkedin && (
                          <a
                            href={sellerDetails.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkedIn color="primary" />
                          </a>
                        )}
                        {!sellerDetails.socialLinks?.instagram &&
                          !sellerDetails.socialLinks?.facebook &&
                          !sellerDetails.socialLinks?.twitter &&
                          !sellerDetails.socialLinks?.linkedin && (
                            <Typography variant="body2">
                              No social links provided
                            </Typography>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Products Section */}
                <Grid item xs={12} md={8}>
                  {/* Top Selling Products */}
                  <Card className="shadow-md rounded-lg mb-4">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Top Selling Products
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {topProducts.length > 0 ? (
                        <Grid container spacing={2}>
                          {topProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                              <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={
                                    product.images?.[0]?.url ||
                                    product.variants?.[0]?.images?.[0]?.url ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={product.name}
                                  className="object-cover"
                                />
                                <CardContent>
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    noWrap
                                  >
                                    {product.name}
                                  </Typography>
                                  <div className="flex justify-between items-center">
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Rs.
                                      {product.variants?.[0]?.price ||
                                        product.price}
                                    </Typography>
                                    {product.variants?.[0]?.discountedPrice && (
                                      <Typography variant="body2" color="error">
                                        Rs.{product.variants[0].discountedPrice}
                                      </Typography>
                                    )}
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <Chip
                                      label={`${product.sold || 0} sold`}
                                      size="small"
                                      color="success"
                                    />
                                    <Typography variant="caption">
                                      {product.variants?.length || 0} variants
                                    </Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography
                          variant="body2"
                          className="text-center py-4"
                        >
                          No top selling products found
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Products */}
                  <Card className="shadow-md rounded-lg">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recently Added Products
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {recentProducts.length > 0 ? (
                        <Grid container spacing={2}>
                          {recentProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                              <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={
                                    product.images?.[0]?.url ||
                                    product.variants?.[0]?.images?.[0]?.url ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={product.name}
                                  className="object-cover"
                                />
                                <CardContent>
                                  <Typography
                                    gutterBottom
                                    variant="subtitle1"
                                    noWrap
                                  >
                                    {product.name}
                                  </Typography>
                                  <div className="flex justify-between items-center">
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Rs.
                                      {product.variants?.[0]?.price ||
                                        product.price}
                                    </Typography>
                                    <Typography variant="caption">
                                      {new Date(
                                        product.createdAt
                                      ).toLocaleDateString()}
                                    </Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography
                          variant="body2"
                          className="text-center py-4"
                        >
                          No recent products found
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className="bg-gray-50 px-4 py-3">
              <Button
                onClick={() => setDetailDialogOpen(false)}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default BrandsManagement;
