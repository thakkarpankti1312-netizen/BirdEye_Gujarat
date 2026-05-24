export const predictBird = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  // STEP 1 → Predict Bird
  const predictResponse = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData,
  });

  const predictData = await predictResponse.json();

  console.log("Prediction API:", predictData);

  // STOP if error
  if (predictData.error) {
    return predictData;
  }

  // STEP 2 → Get Bird Info from CSV
  const infoResponse = await fetch(
    `http://127.0.0.1:5000/bird-info?name=${encodeURIComponent(
      predictData.prediction
    )}`
  );

  const infoData = await infoResponse.json();

  console.log("Bird Info API:", infoData);

  // FINAL RETURN
  return {
    prediction: predictData.prediction,
    confidence: predictData.confidence,
    info: infoData,
  };
};