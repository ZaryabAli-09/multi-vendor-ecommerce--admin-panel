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
} from "@mui/material";

const OrderDetailsModal = ({ open, onClose, orderId }) => {
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    if (orderId) {
      // Fetch order details from the backend
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
          width: "90%", // Adjusted for better responsiveness
          maxWidth: 800,
          maxHeight: "90vh", // Limit height for small screens
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflowY: "auto", // Make the modal scrollable
        }}
      >
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <Typography variant="body1" gutterBottom>
          Order ID: {order._id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Customer: {order.orderBy?.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Customer Email: {order.orderBy?.email}
        </Typography>

        {/* Display Order Items */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Discounted Price</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item) => {
                // Find the selected variant
                const selectedVariant = item.product.variants.find(
                  (variant) =>
                    variant._id.toString() === item.variantId.toString()
                );

                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={selectedVariant.images[0].url}
                          alt={item.product.name}
                          style={{
                            width: 50,
                            height: 50,
                            marginRight: 10,
                            borderRadius: "8px", // Rounded corners for the image
                          }}
                        />
                        <Typography variant="body2">
                          {item.product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%", // Round shape for color
                            backgroundColor: selectedVariant.color,
                            marginRight: 1,
                          }}
                        />
                        <Typography variant="body2">
                          Size: {selectedVariant.size}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {selectedVariant.discountedPrice ? (
                        <>
                          <span className="line-through opacity-40">
                            {selectedVariant.price}
                          </span>{" "}
                          {selectedVariant.discountedPrice}
                        </>
                      ) : (
                        selectedVariant.price
                      )}
                    </TableCell>
                    <TableCell>
                      {selectedVariant.discountedPrice
                        ? `$${selectedVariant.discountedPrice}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {selectedVariant.discountedPrice ? (
                        <>
                          <span className="line-through opacity-40">
                            {selectedVariant.price * item.quantity}
                          </span>{" "}
                          {selectedVariant.discountedPrice * item.quantity}
                        </>
                      ) : (
                        selectedVariant.price * item.quantity
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1">Total: ${order.totalAmount}</Typography>
          <Typography variant="body1">Status: {order.status}</Typography>
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
