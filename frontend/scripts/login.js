const form = document.getElementById("loginForm");
const message = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // The field can be either username or email — same box.
  const identifier = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!identifier || !password) {
    message.textContent = "Please enter both username/email and password.";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // backend accepts this as either email OR username
      body: JSON.stringify({ email: identifier, password: password })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.detail || "Login failed.";
      return;
    }

    // Store the user ID in localStorage
    localStorage.setItem("user_id", data.user_id);

    message.textContent = "Login successful! Redirecting...";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (err) {
    console.error(err);
    message.textContent = "Error connecting to server.";
  }
});
