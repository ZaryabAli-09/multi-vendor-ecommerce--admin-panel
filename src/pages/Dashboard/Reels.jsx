import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminReels = () => {
  const [reels, setReels] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

  const fetchReels = async (page) => {
    setIsFetching(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/reels/admin?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      setReels(result.data.data);
      const totalPages = Math.ceil(result.data.total / limit);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchReels(value);
  };

  useEffect(() => {
    fetchReels(currentPage);
  }, [currentPage]);

  return (
    <Box>
      <h2 className="text-xl md:text-4xl mb-10"> All Platform Reels</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Reel</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Product ID</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Uploaded At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : reels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No reels found.
                </TableCell>
              </TableRow>
            ) : (
              reels.map((reel, idx) => (
                <TableRow key={reel._id}>
                  <TableCell>{(currentPage - 1) * limit + idx + 1}</TableCell>
                  <TableCell>
                    <video
                      src={reel.videoUrl}
                      controls
                      width={150}
                      height={80}
                    />
                  </TableCell>
                  <TableCell>{reel.uploadedBy?.brandName || "N/A"}</TableCell>
                  <TableCell>{reel.productName || "Unknown"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        navigate(`/dashboard/product/${reel.caption}`)
                      }
                      variant="outlined"
                      size="small"
                    >
                      {reel.caption}
                    </Button>
                  </TableCell>
                  <TableCell>{reel.likes ?? 0}</TableCell>
                  <TableCell>
                    {new Date(reel.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isFetching && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminReels;
