import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Typography,
  Pagination,
  TextField,
  Box,
} from "@mui/material";
import { toast } from "react-hot-toast";

const Billing = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [sellerBillingsInfo, setSellerBillingsInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const fetchAllSellerBillingsInfo = async (page = 1, search = "") => {
    try {
      setIsFetching(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/seller/billinginfo?page=${page}&limit=${limit}&search=${search}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();
      console.log("API Response:", result); // Debug log

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch billing info");
      }

      setSellerBillingsInfo(result.data.data);
      setTotalPages(result.data.totalPages || 1);
    } catch (error) {
      toast.error(error.message);
      setSellerBillingsInfo([]); // Reset to empty array on error
    } finally {
      setIsFetching(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchAllSellerBillingsInfo(page, searchTerm);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchAllSellerBillingsInfo(1, value);
  };

  useEffect(() => {
    fetchAllSellerBillingsInfo(currentPage, searchTerm);
  }, []);

  return (
    <TableContainer component={Paper} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <h2 className="text-xl md:text-2xl mb-6">Brands Billing Information</h2>

        <TextField
          label="Search by Brand Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Bank Name</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Account Holder Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetching ? (
            Array.from({ length: limit }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {[...Array(5)].map((_, i) => (
                  <TableCell key={`skeleton-cell-${i}`}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : sellerBillingsInfo.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No brands found
              </TableCell>
            </TableRow>
          ) : (
            sellerBillingsInfo.map((info, index) => (
              <TableRow key={info._id || `row-${index}`}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>{info?.brandName || "N/A"}</TableCell>
                <TableCell>{info?.bankDetails?.bankName || "N/A"}</TableCell>
                <TableCell>
                  {info?.bankDetails?.accountNumber || "N/A"}
                </TableCell>
                <TableCell>
                  {info?.bankDetails?.accountHolderName || "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </TableContainer>
  );
};

export default Billing;
