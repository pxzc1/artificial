const BACKEND_URL = window.location.origin;
async function loadSubmissions() {
  try {
    const res = await fetch(`${BACKEND_URL}/submissions`);
    const submissions = await res.json();
    const grid = document.getElementById("submissions-grid");
    grid.innerHTML = "";
    submissions.forEach(sub => {
      const card = document.createElement("div");
      card.className = "submission-card";
      card.innerHTML = `
        <div class="image-container">
          <img src="${BACKEND_URL}${sub.url}" alt="${sub.filename}">
        </div>
        <div class="submission-details">
          <div class="submitter-name">${sub.nickname}</div>
          <ul class="file-details-list">
            <li class="detail-item"><span class="detail-label">File:</span><span class="detail-value">${sub.filename}</span></li>
            <li class="detail-item"><span class="detail-label">Time:</span><span class="detail-value">${sub.timestamp}</span></li>
          </ul>
          <button class="delete-btn" data-filename="${sub.filename}">Delete</button>
        </div>
      `;
      grid.appendChild(card);
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const filename = btn.getAttribute("data-filename");
        try {
          const res = await fetch(`${BACKEND_URL}/delete/${filename}`, { method: "DELETE" });
          const data = await res.json();
          if (data.status === "success") loadSubmissions();
        } catch {}
      });
    });
  } catch {}
}
loadSubmissions();
setInterval(loadSubmissions, 5000);