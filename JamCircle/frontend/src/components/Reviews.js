// Reviews.js
import React, { useEffect, useState } from "react";

const Reviews = ({ spotifyContentId }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [spotifyContentId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/reviews/get_reviews/`, // Ensure the URL matches your Django routing pattern
        {
          method: "POST", // Assuming the Django view is expecting a GET request
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials as in the SongPage component
          body: JSON.stringify({ spotify_content_id: spotifyContentId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("There was an error fetching the reviews:", error);
    }
  };

  const postReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/reviews/post_review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            spotify_content_id: spotifyContentId,
            text: reviewText,
            rating: rating,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post review");
      }

      setReviewText("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error("There was an error posting the review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-container">
      <h2>Reviews</h2>

      <div className="review-form-container">
        <form onSubmit={postReview}>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0.5"
            max="5"
            step="0.5"
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review-box">
            <div className="review-details">
              <p className="author-rating-date">
                <strong>Author:</strong> {review.author_display_name}
              </p>
              <p className="author-rating-date">
                <strong>Rating:</strong> {review.rating}
              </p>
              <p className="author-rating-date">
                <strong>Posted on:</strong>{" "}
                {new Date(review.posted_at).toLocaleDateString()}
              </p>
            </div>
            <div className="review-text">
              <p>{review.text}</p>
            </div>
          </div>
        ))
      ) : (
        <h1>No reviews yet.</h1>
      )}
    </div>
  );
};

export default Reviews;
