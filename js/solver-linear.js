window.solveLinear = async function () {
  const P = document.getElementById("lin-P").value.trim();
  const Q = document.getElementById("lin-Q").value.trim();

  const response = await fetch("https://back-calcu-but6.onrender.com/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "lin",
      P,
      Q
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo resolver la ecuación lineal.");
  }

  return data;
};
