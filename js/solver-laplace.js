window.solveLaplace = async function () {
  const expression = document.getElementById("lap-ft").value.trim();
  const mode = document.getElementById("lap-mode").value;

  const response = await fetch("https://back-calcu-but6.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "lap",
      expression,
      mode
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo resolver Laplace.");
  }

  return data;
};