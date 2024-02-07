export const config = {
  api: process.env.REACT_APP_TRADEFAST_API_URL!,
  cloudinary: {
    url: "https://api.cloudinary.com/v1_1/dmhsxloua/image/upload",
    preset: "ml_default",
    cloudName: "dmhsxloua",
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY!,
  },
};
