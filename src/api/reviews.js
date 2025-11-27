import client from "./client";

export const getReviews = (restaurantId) =>
  client.get(`/api/reviews/${restaurantId}`);

export const addReview = (restaurantId, data) =>
  client.post(`/api/reviews/${restaurantId}`, data);

export const deleteReview = (reviewId) =>
  client.delete(`/api/reviews/${reviewId}`);
