import axios from "axios";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwPsKXNkwPXmBfkwyTKteH0bFlNHIdxN4zBHNQt6BCk4NlRcOM5pGT2ZvHdrqw6JiDd/exec";

export const getProduct = async (barcode) => {
  const response = await axios.get(API_URL, {
    params: {
      barcode,
    },
  });

  return response.data;
};