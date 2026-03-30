window.solveExact = async function () {
  const M = document.getElementById("exa-M").value.trim();
  const N = document.getElementById("exa-N").value.trim();

  const response = await fetch("https://back-calcu-but6.onrender.com/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "exa",
      M,
      N
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo resolver la ecuación exacta.");
  }

  return data;
};
