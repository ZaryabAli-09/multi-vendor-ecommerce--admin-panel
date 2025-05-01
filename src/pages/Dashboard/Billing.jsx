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
  Pagination,
  TextField,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";

const Billing = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [sellerBillingsInfo, setSellerBillingsInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  console.log(sellerBillingsInfo);

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
      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch billing info");
      }

      setSellerBillingsInfo(result.data.data);
      setTotalPages(result.data.totalPages || 1);
    } catch (error) {
      toast.error(error.message);
      setSellerBillingsInfo([]);
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <HiOutlineBanknotes className="text-2xl text-gray-800" />
          <h2 className="text-2xl font-bold text-gray-800">
            Brands Billing Information
          </h2>
        </div>

        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <TextField
            fullWidth
            size="small"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              className: "pl-10 pr-4 py-2 text-sm",
              style: {
                borderRadius: "0.5rem",
              },
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        className="rounded-lg overflow-hidden border border-gray-200"
      >
        <Table className="min-w-full">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold text-gray-700">#</TableCell>
              <TableCell className="font-semibold text-gray-700">
                <div className="flex items-center gap-1">
                  <HiOutlineBuildingOffice2 className="text-gray-600" />
                  Brand Name
                </div>
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Bank Name
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Account Number
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                <div className="flex items-center gap-1">
                  <HiOutlineUserCircle className="text-gray-600" />
                  Account Holder
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="hover:bg-gray-50"
                >
                  {[...Array(5)].map((_, i) => (
                    <TableCell key={`skeleton-cell-${i}`}>
                      <Skeleton variant="text" className="w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sellerBillingsInfo.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              sellerBillingsInfo.map((info, index) => (
                <TableRow
                  key={info._id || `row-${index}`}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <TableCell className="text-gray-600">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      {info?.logo?.url ? (
                        // Show logo if exists
                        <img
                          src={info.logo.url}
                          alt={`${info.brandName} logo`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        // Show avatar with first letter if no logo
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {info?.brandName?.charAt(0).toUpperCase() || "N"}
                          </span>
                        </div>
                      )}
                      <span>{info?.brandName || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {info?.bankDetails?.bankName || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-gray-700">
                    {info?.bankDetails?.accountNumber || "N/A"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {info?.bankDetails?.accountHolderName || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            className="[&_.MuiPaginationItem-root]:text-gray-700 [&_.Mui-selected]:bg-black [&_.Mui-selected]:text-white"
          />
        </div>
      )}
    </div>
  );
};

export default Billing;
