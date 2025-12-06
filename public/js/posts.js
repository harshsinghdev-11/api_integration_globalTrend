
    async function checkLoginAndFetchPosts() {
      try {
        // 1️⃣ Check login
        const loginRes = await fetch("/api/auth/isLogin", {
          method: "GET",
          credentials: "include"
        });

        if (loginRes.status !== 200) {
          window.location.href = "/api/auth/login";
          return;
        }

        const user = await loginRes.json();

        // Set username greeting
        document.getElementById("welcomeText").innerHTML =
          `Welcome back, <strong>${user.username}</strong>`;

        // 2️⃣ Fetch posts
        const postsRes = await fetch("/api/getPosts", {
          method: "GET",
          credentials: "include"
        });

        const data = await postsRes.json();
        const container = document.getElementById("postsContainer");

        if (!data.posts || data.posts.length === 0) {
          container.innerHTML = `<div class="empty">No posts available. Start saving posts from the dashboard!</div>`;
          return;
        }

        // 3️⃣ Build table
        let html = `
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Body</th>
                <th>Idjson</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
        `;

        data.posts.forEach(p => {
          html += `
            <tr>
              <td>${p.title}</td>
              <td>${p.body}</td>
              <td>${p.Idjson ?? "—"}</td>
              <td>${p.userId ?? "—"}</td>
            </tr>
          `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;

      } catch (err) {
        console.error(err);
        window.location.href = "/api/auth/login";
      }
    }

    checkLoginAndFetchPosts();

    const deletePostBtn = document.getElementById("deletePost");

deletePostBtn.addEventListener("click", async function() {
    try {
        const response = await fetch("/api/deleteAllPosts", {
            credentials: "include"
        });

        if (response.ok) {
            alert("All posts deleted successfully!");
            window.location.href = "/api/posts"; 
        } else if (response.status === 401) {
            alert("Please login");
            window.location.href = "/api/auth/login"; 
        } else {
            const text = await response.text();
            alert("Error deleting posts: " + text);
        }
    } catch (err) {
        console.error(err);
        alert("Server error while deleting posts");
    }
});

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click",async function () {
  const res = await fetch("/api/auth/logout");
  const response = await res.json();
  if(res.status===500){
    alert("Error logging out")
  }

  window.location.href = "/";


})

  