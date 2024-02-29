// Reviews.js
import React, { useEffect, useState } from "react";
import { Container, Typography,
  TextField, Rating, Button, Box, Paper, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1b1c1b',
      paper: '#252525',
    },
    primary: {
      main: '#cccccc',
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reviews
        </Typography>
        <Box component="form" onSubmit={postReview} noValidate sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            margin="normal"
            required
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              precision={0.5}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 1 }} size="small">
              Submit Review
            </Button>
          </Stack>
        </Box>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Author:</strong> {review.author_display_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Rating:</strong> {review.rating}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Posted on:</strong> {new Date(review.posted_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">{review.text}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="h6">No reviews yet.</Typography>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Reviews;
