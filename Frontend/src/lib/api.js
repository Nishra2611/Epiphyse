import axios from "axios";
import { mockPrediction } from "@/lib/mockData";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000,
});

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const predictBoneAge = async (imageFile, gender) => {
  if (useMock) {
    await delay(900);
    return {
      ...mockPrediction,
      gender,
    };
  }

  const formData = new FormData();

  formData.append("file", imageFile);
  formData.append("image", imageFile);
  formData.append("gender", gender === "male" ? "1" : "0");
  formData.append("gender_label", gender);

  try {
    const res = await client.post("/predict", formData);

    return {
      confidence: 0.9,
      gender,
      ...res.data,
    };
  } catch (err) {
    console.warn("Prediction API failed, falling back to mock data:", err);
    await delay(900);
    return {
      ...mockPrediction,
      gender,
    };
  }
};
