async function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    document.getElementById("error-msg").innerText = "Enter all fields!";
    return;
  }

  // Fake authentication with API
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  const validUser = users.find(u => u.username.toLowerCase() === user.toLowerCase());

  if (validUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(validUser));
    window.location.href = "todo.html";
  } else {
    document.getElementById("error-msg").innerText = "Invalid credentials!";
  }
}

// Auto redirect if already logged in
if (localStorage.getItem("loggedInUser")) {
  window.location.href = "todo.html";
}
