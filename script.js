
const gallery = document.getElementById("gallery");
const modal = document.getElementById("uploadModal");
const uploadBtn = document.getElementById("uploadBtn");
const closeModal = document.getElementById("closeModal");
const uploadForm = document.getElementById("uploadForm");
const mediaFile = document.getElementById("mediaFile");
const preview = document.getElementById("preview");
const search = document.getElementById("search");

let uploadedPosts = [];

// Open and close upload window
uploadBtn.onclick = () => modal.classList.add("show");

closeModal.onclick = () => modal.classList.remove("show");

modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
};

// Preview uploaded file
mediaFile.onchange = () => {
  const file = mediaFile.files[0];
  preview.innerHTML = "";

  if (!file) return;

  if (!file.type.startsWith("image/") &&
      !file.type.startsWith("video/")) {
    alert("Please select an image or video.");
    mediaFile.value = "";
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    alert("File size must be below 50 MB.");
    mediaFile.value = "";
    return;
  }

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    preview.innerHTML =
      `<img src="${url}" alt="Preview">`;
  } else {
    preview.innerHTML =
      `<video src="${url}" controls></video>`;
  }
};

// Publish post
uploadForm.onsubmit = (e) => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const description =
    document.getElementById("postDescription").value.trim();

  const file = mediaFile.files[0];

  if (!file || !title) return;

  const url = URL.createObjectURL(file);
  const isVideo = file.type.startsWith("video/");

  const post = document.createElement("article");
  post.className = "post";

  const media = isVideo
    ? `<video src="${url}" controls></video>`
    : `<img src="${url}" alt="Uploaded photo">`;

  post.innerHTML = `
    ${media}
    <div class="post-info">
      <h3></h3>
      <p></p>
      <div class="actions">
        <button class="like">♡ <span>0</span></button>
        <button class="save">☆ Save</button>
        <button class="delete">🗑</button>
      </div>
    </div>
  `;

  post.querySelector("h3").textContent = title;
  post.querySelector(".post-info p").textContent =
    description || "Shared on Pixora";

  gallery.prepend(post);
  uploadedPosts.push({ post, url });

  uploadForm.reset();
  preview.innerHTML = "";
  modal.classList.remove("show");
};

// Like, save and delete actions
gallery.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const post = button.closest(".post");
  if (!post) return;

  if (button.classList.contains("like")) {
    button.classList.toggle("liked");

    const count = button.querySelector("span");
    count.textContent =
      Number(count.textContent) +
      (button.classList.contains("liked") ? 1 : -1);
  }

  if (button.classList.contains("save")) {
    button.classList.toggle("saved");
    button.textContent =
      button.classList.contains("saved")
        ? "★ Saved"
        : "☆ Save";
  }

  if (button.classList.contains("delete")) {
    if (confirm("Delete this post?")) {
      const index = uploadedPosts.findIndex(
        item => item.post === post
      );

      if (index !== -1) {
        URL.revokeObjectURL(uploadedPosts[index].url);
        uploadedPosts.splice(index, 1);
      }

      post.remove();
    }
  }
});

// Search posts
search.addEventListener("input", () => {
  const query = search.value.toLowerCase();
  let visible = 0;

  document.querySelectorAll(".post").forEach(post => {
    const matches = post.textContent.toLowerCase()
      .includes(query);

    post.style.display = matches ? "inline-block" : "none";

    if (matches) visible++;
  });

  document.getElementById("emptyMessage").hidden =
    visible !== 0;
});
