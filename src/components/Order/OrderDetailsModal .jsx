import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineCash,
  HiInformationCircle,
} from "react-icons/hi";

const OrderDetailsModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    if (orderId) {
      fetch(`${import.meta.env.VITE_API_URL}/order/${orderId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setOrder(data.data.data))
        .catch((error) => console.error(error));
    }
  }, [orderId]);

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <HiOutlineShoppingBag size={24} />
            Order Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            {/* Order Information */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1">{order._id}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HiOutlineCalendar size={16} />
                  Order Date
                </Box>
              </Typography>
              <Typography variant="body1">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>

            {/* Customer Information */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HiOutlineUser size={16} />
                  Customer
                </Box>
              </Typography>
              <Typography variant="body1">
                {order.orderBy?.name || "Guest"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HiOutlineMail size={16} />
                  Contact
                </Box>
              </Typography>
              <Typography variant="body1">
                {order.orderBy?.email || "No email provided"}
                {order.orderBy?.phone && (
                  <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                    {order.orderBy.phone}
                  </Box>
                )}
              </Typography>
            </Box>

            {/* Payment Information */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {order.paymentMethod === "card" ? (
                    <HiOutlineCreditCard size={16} />
                  ) : (
                    <HiOutlineCash size={16} />
                  )}
                  Payment Method
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {order.paymentMethod === "card"
                  ? "Credit Card"
                  : "Cash on Delivery"}
                {order.paymentDetails?.transactionId && (
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    Transaction: {order.paymentDetails.transactionId}
                  </Box>
                )}
              </Typography>
            </Box>

            {/* Order Status */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={order.status}
                size="small"
                color={
                  order.status === "delivered"
                    ? "success"
                    : order.status === "canceled"
                    ? "error"
                    : order.status === "shipped"
                    ? "info"
                    : "default"
                }
                sx={{ textTransform: "capitalize" }}
              />
            </Box>
          </Box>
        </Box>

        {/* Order Items Table */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price (Rs.)</TableCell>
                <TableCell>Total (Rs.)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order?.orderItems?.map((item) => {
                const isProductDeleted = !item.product;

                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={
                            isProductDeleted
                              ? "https://placehold.co/50x50?text=Product+Deleted"
                              : item.productImage ||
                                "https://placehold.co/50x50"
                          }
                          alt={item.productName}
                          style={{
                            width: 50,
                            height: 50,
                            marginRight: 10,
                            borderRadius: "8px",
                            opacity: isProductDeleted ? 0.5 : 1,
                          }}
                        />
                        <Box>
                          <Typography variant="body2">
                            {item.productName}
                          </Typography>
                          {isProductDeleted && (
                            <Chip
                              label="Product Deleted"
                              size="small"
                              color="warning"
                              icon={<HiInformationCircle size={16} />}
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {item.variantColor && (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: item.variantColor,
                              marginRight: 1,
                              opacity: isProductDeleted ? 0.5 : 1,
                            }}
                          />
                        )}
                        <Typography variant="body2">
                          Size: {item.variantSize || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.priceAtPurchase.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {(item.priceAtPurchase * item.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Order Summary */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Total: Rs. {order.totalAmount.toLocaleString()}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Status:
            </Typography>
            <Chip
              label={order.status}
              size="small"
              color={
                order.status === "delivered"
                  ? "success"
                  : order.status === "canceled"
                  ? "error"
                  : order.status === "shipped"
                  ? "info"
                  : "default"
              }
              sx={{ textTransform: "capitalize" }}
            />
          </Box>
        </Box>

        <Button
          onClick={onClose}
          variant="contained"
          sx={{ mt: 2, width: "100%" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;
