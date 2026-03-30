window.solveSeparable = async function () {
  const fx = document.getElementById("sep-fx").value.trim();
  const gy = document.getElementById("sep-gy").value.trim();

  const response = await fetch("http://127.0.0.1:5000/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "sep",
      fx,
      gy
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo resolver por separación de variables.");
  }

  return data;
};