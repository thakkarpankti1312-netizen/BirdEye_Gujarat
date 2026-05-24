export const predictBird = async (file: File) => {

  const formData = new FormData();

  formData.append("image", file);

  // ONLY ONE API CALL
  const response = await fetch(
    "http://127.0.0.1:5000/predict",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  console.log("FINAL API RESPONSE:", data);

  return data;
};