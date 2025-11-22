document.getElementById("newAccountForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page reload

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  const payload = { username, password, email };

  try {
    const response = await fetch("https://web-production-75f23.up.railway.app/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      let message = "Failed to create user";

      if(Array.isArray(errorData.detail)) {
        message = errorData.detail[0]?.msg || message;
    } else if (errorData.detail) {
        message = errorData.detail;
    }

      throw new Error(message); // Throw error to be caught below
    }

    const data = await response.json();
    console.log("✅ User created:", data);
    alert(`User ${data.username} created successfully!`);


    window.location.href = "login.html";
  } catch (error) {
    console.error("❌ Error creating user:", error);
    alert("Error creating user: " + error.message);
  }
});