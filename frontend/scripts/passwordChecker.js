const passwordField = document.getElementById("password");

    passwordField.addEventListener("input", () => {
      const value = passwordField.value;

      updateReq("req-length", value.length >= 8);
      updateReq("req-upper", /[A-Z]/.test(value));
      updateReq("req-lower", /[a-z]/.test(value));
      updateReq("req-digit", /[0-9]/.test(value));
      updateReq("req-special", /[^A-Za-z0-9]/.test(value));
    });

    function updateReq(id, ok) {
      const item = document.getElementById(id);

      if (ok) {
        item.classList.add("valid");
        item.classList.remove("invalid");
        item.textContent = "✔ " + item.textContent.replace(/^✔ |^❌ /, "");
      } else {
        item.classList.add("invalid");
        item.classList.remove("valid");
        item.textContent = "❌ " + item.textContent.replace(/^✔ |^❌ /, "");
      }
    }