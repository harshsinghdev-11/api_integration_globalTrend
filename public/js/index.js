
let cachedPosts = [];
let displayedPosts = []; 

const messageBox = document.getElementById("messageBox");
const tableBox = document.getElementById("tableBox");

function showMessage(msg, type = "success") {
    messageBox.innerHTML = msg;
    messageBox.className = 'show';
    messageBox.style.background = type === "success" ? "#d4edda" : "#f8d7da";
    messageBox.style.color = type === "success" ? "#155724" : "#721c24";
    messageBox.style.border = type === "success" ? "2px solid #c3e6cb" : "2px solid #f5c6cb";
    
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 5000);
}

function showLoading() {
    tableBox.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <div style="font-size: 18px; font-weight: 600;">Loading data...</div>
        </div>
    `;
}

function renderTable(dataArr) {
    if (!dataArr) return;

    if (!Array.isArray(dataArr)) dataArr = [dataArr];
    
    displayedPosts = dataArr; // Track displayed posts

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Body</th>
                    <th>User ID</th>
                </tr>
            </thead>
            <tbody>
    `;

    dataArr.forEach(item => {
        html += `
        <tr>
            <td><strong>${item.id}</strong></td>
            <td>${item.title}</td>
            <td>${item.body}</td>
            <td><strong>${item.userId}</strong></td>
        </tr>`;
    });

    html += "</tbody></table>";
    tableBox.innerHTML = html;
}

function isValidNumber(n) {
    return n !== "" && !isNaN(n) && Number(n) > 0;
}

let isRedirecting = false; 

document.getElementById("saveAllPosts").addEventListener("click", async () => {
    if (displayedPosts.length === 0) return showMessage("No posts displayed to save", "error");
    

    if (isRedirecting) return;

    try {
        
        const transformedPosts = displayedPosts.map(post => ({
            title: post.title,
            body: post.body,
            Idjson: post.id,  // Map 'id' to 'Idjson'
            userId: post.userId
        }));

        const response = await fetch("/api/add-multiple", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ posts: transformedPosts }),
        });
        console.log(response)

        if (response.status === 401) {
            // Check if we're already on login/register page to prevent loop
            const currentPath = window.location.pathname;
            if (currentPath.includes('/login') || currentPath.includes('/register')) {
                showMessage("Please login to save posts", "error");
                return;
            }
            
            // Prevent multiple redirects
            if (!isRedirecting) {
                isRedirecting = true;
                showMessage("Session expired. Redirecting to login...", "error");
                setTimeout(() => {
                    window.location.href = "/api/auth/login";
                }, 1000);
            }
            return;
        }

        const json = await response.json();
        if (response.ok) {
            showMessage(`Successfully saved ${displayedPosts.length} posts!`);
        } else {
            showMessage(json.message || "Error saving posts", "error");
        }
    } catch (err) {
        showMessage("Server error while saving posts", "error");
        console.error(err);
    } finally {
        isRedirecting = false;
    }
});

document.getElementById("submitId").addEventListener("click", async () => {
    const idVal = document.getElementById("id").value;

    if (!isValidNumber(idVal)) return showMessage("Please enter a valid numeric ID", "error");

    showLoading();
    try {
        const response = await fetch(`/api/jsonPlaceHolder/post/${idVal}`);
        const json = await response.json();

        if (!json.success) return showMessage("Post not found", "error");

        // Display single post without overwriting cache
        showMessage("Post fetched successfully!");
        renderTable(json.data);
        document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    } catch {
        showMessage("Server error while fetching post", "error");
        tableBox.innerHTML = '';
    }
});


document.getElementById("fetchhundredPost").addEventListener("click", async () => {
    showLoading();
    try {
        const response = await fetch("/api/jsonPlaceHolder/posts");
        const json = await response.json();

        cachedPosts = json.data; // Update cache
        showMessage(`Successfully fetched ${json.count} posts!`);
        renderTable(cachedPosts);
        document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    } catch {
        showMessage("Error fetching posts", "error");
        tableBox.innerHTML = '';
    }
});


document.getElementById("userPost").addEventListener("click", async () => {
    const userId = document.getElementById("userId").value;

    if (!isValidNumber(userId)) return showMessage("Please enter a valid User ID", "error");

    showLoading();
    try {
        const response = await fetch(`/api/jsonPlaceHolder/posts/user/${userId}`);
        const json = await response.json();

        cachedPosts = json.data; // Update cache
        showMessage(`Found ${json.count} posts for user ${userId}`);
        renderTable(cachedPosts);
        document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    } catch {
        showMessage("Error fetching user posts", "error");
        tableBox.innerHTML = '';
    }
});


document.getElementById("applyFilter").addEventListener("click", () => {
    if (cachedPosts.length === 0) {
        return showMessage("Please fetch posts first before filtering", "error");
    }

    let filtered = [...cachedPosts];
    const keyword = document.getElementById("filterKeyword").value.toLowerCase().trim();
    const userId = document.getElementById("filterUserId").value;
    const minLen = parseInt(document.getElementById("filterMinLength").value);
    const maxLen = parseInt(document.getElementById("filterMaxLength").value);

    if (keyword) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(keyword) || 
            p.body.toLowerCase().includes(keyword)
        );
    }
    
    if (userId && isValidNumber(userId)) {
        filtered = filtered.filter(p => p.userId == userId);
    }
    
    if (!isNaN(minLen) && minLen >= 0) {
        filtered = filtered.filter(p => p.body.length >= minLen);
    }
    
    if (!isNaN(maxLen) && maxLen >= 0) {
        filtered = filtered.filter(p => p.body.length <= maxLen);
    }

    showMessage(`Found ${filtered.length} posts after applying filters`);
    renderTable(filtered);
    document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

/* -------------------------------------------
    Clear Filter
--------------------------------------------*/
document.getElementById("clearFilter").addEventListener("click", () => {
    if (cachedPosts.length === 0) {
        return showMessage("No cached posts to display", "error");
    }

    // Clear filter inputs
    document.getElementById("filterKeyword").value = '';
    document.getElementById("filterUserId").value = '';
    document.getElementById("filterMinLength").value = '';
    document.getElementById("filterMaxLength").value = '';

    // Show all cached posts
    showMessage(`Displaying all ${cachedPosts.length} cached posts`);
    renderTable(cachedPosts);
    document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

/* -------------------------------------------
    POST: Create a new post
--------------------------------------------*/
document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const userId = document.getElementById("createuserId").value;

    if (!title || !body || !isValidNumber(userId))
        return showMessage("Title, Body, and User ID are required!", "error");

    try {
        const response = await fetch("/api/jsonPlaceHolder/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId: Number(userId) })
        });

        const json = await response.json();

        // Add created post to cache if it's an object
        if (json.created) {
            cachedPosts.unshift(json.created); // Add to beginning of array
        }

        showMessage("Post created successfully!");
        renderTable(json.created);
        document.getElementById("createForm").reset();
        document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    } catch {
        showMessage("Error creating post", "error");
    }
});

/* -------------------------------------------
    PUT: Update Post
--------------------------------------------*/
document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("UpdateId").value;
    const title = document.getElementById("updateTitle").value.trim();
    const body = document.getElementById("updateBody").value.trim();
    const userId = document.getElementById("updateUserId").value;

    if (!isValidNumber(id) || !title || !body || !isValidNumber(userId)) {
        return showMessage("Please enter valid data in all fields", "error");
    }

    try {
        const res = await fetch(`/api/jsonPlaceHolder/post/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId: Number(userId) })
        });

        const json = await res.json();

        // Update cache if post exists
        const index = cachedPosts.findIndex(p => p.id == id);
        if (index !== -1) {
            cachedPosts[index] = json.updated;
            showMessage("Post updated successfully in cache!");
        } else {
            showMessage("Post updated successfully (not in cache)!");
        }
        
        renderTable(json.updated);
        document.getElementById("updateForm").reset();
        document.getElementById("saveAllPosts").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    } catch {
        showMessage("Error updating post", "error");
    }
});
