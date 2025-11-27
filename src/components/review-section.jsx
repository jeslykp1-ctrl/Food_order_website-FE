// src/pages/components/ReviewsSection.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Rating,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/auth-context";
import { getReviews, addReview, deleteReview } from "../api/reviews"

export default function ReviewsSection({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { authUser } = useAuth();

  // Load reviews
  const loadReviews = async () => {
    try {
      const res = await getReviews(restaurantId);
      setReviews(res.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [restaurantId]);

  // Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!rating) return;

    try {
      await addReview(restaurantId, { rating, comment });
      setRating(0);
      setComment("");
      loadReviews();
    } catch (error) {
      console.error("Failed to add review:", error);
      alert(error.response?.data?.message || "Error adding review");
    }
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      loadReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Error deleting review");
    }
  };

  return (
    <div className="space-y-4">
      {authUser && (
        <Card className="p-4 shadow mb-4">
          <Typography variant="h6" className="mb-2 font-bold">
            Write a Review
          </Typography>
          <form onSubmit={handleAddReview}>
            <Rating
              value={rating}
              onChange={(e, val) => setRating(val)}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="mt-3"
            />
            <Button
              variant="contained"
              type="submit"
             sx={{ backgroundColor: "rgb(245,89,5)", borderRadius: "8px", marginTop:"10px" }}
              disabled={!rating}
            >
              Submit Review
            </Button>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="p-6 shadow">
        <Typography variant="h6" className="font-bold mb-3">
          Reviews
        </Typography>

        {reviews.length === 0 ? (
          <Typography>No reviews yet.</Typography>
        ) : (
          reviews.map((rev) => (
            <Card key={rev._id} className="p-4 mb-3 shadow-sm relative">
              <Typography className="font-semibold">
                {rev.user?.username || "User"}
              </Typography>
              <Rating value={rev.rating} readOnly size="small" />
              <Typography className="mt-1">{rev.comment || "--"}</Typography>
              <Typography className="text-gray-500 text-sm mt-1">
                {new Date(rev.createdAt).toLocaleString()}
              </Typography>

              {/* Delete button: only author or admin */}
              {authUser &&
                (authUser.id === rev.user?._id || authUser.role === "admin") && (
                  <Box className="absolute top-2 right-2">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(rev._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
            </Card>
          ))
        )}
      </Card>
    </div>
  );
}
