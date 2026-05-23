export async function predictBird(file: File) {

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:5000/predict", {

    method: "POST",

    body: formData,
  });

  const data = await response.json();

  return data;
}