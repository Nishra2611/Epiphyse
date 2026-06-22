export const mockPrediction = {
  bone_age_months: 132,
  confidence: 0.94,
  gender: "male",
};

export const modelMetrics = [
  { name: "Images", value: 12611, label: "Training images" },
  { name: "MAE", value: 8.01, label: "Validation MAE in months (TTA)" },
  { name: "Inputs", value: 2, label: "Image plus gender" },
];
