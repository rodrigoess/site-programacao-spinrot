// google-auth.js - Google Sign-In functionality

// Handle Google Sign-In response
function handleCredentialResponse(response) {
  try {
    // Decode the JWT token
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log("Full Name: " + responsePayload.name);
    console.log("Given Name: " + responsePayload.given_name);
    console.log("Family Name: " + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    // Store user info in localStorage
    localStorage.setItem("user_name", responsePayload.name);
    localStorage.setItem("user_email", responsePayload.email);
    localStorage.setItem("user_picture", responsePayload.picture);
    localStorage.setItem("is_logged_in", "true");

    // Redirect to main page or show success message
    alert("Login com Google bem-sucedido! Bem-vindo, " + responsePayload.name);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error handling Google Sign-In response:", error);
    alert("Erro no login com Google. Tente novamente.");
  }
}

// Decode JWT token
function decodeJwtResponse(token) {
  try {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    throw error;
  }
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
  try {
    // This function is called when the Google script loads
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    // Render the sign-in buttons
    google.accounts.id.renderButton(document.querySelector(".g_id_signin"), {
      theme: "outline",
      size: "large",
    });
  } catch (error) {
    console.error("Error initializing Google Sign-In:", error);
  }
}

// Logout function
function googleSignOut() {
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_picture");
  localStorage.removeItem("is_logged_in");

  // Sign out from Google
  try {
    google.accounts.id.disableAutoSelect();
  } catch (error) {
    console.error("Error signing out from Google:", error);
  }

  alert("Logout realizado com sucesso!");
  window.location.href = "login.html";
}

// Check if user is logged in
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("is_logged_in");
  const userName = localStorage.getItem("user_name");

  if (isLoggedIn === "true" && userName) {
    // User is logged in, update UI accordingly
    console.log("User logged in:", userName);
    // You can add code here to update the navbar or show user info
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  checkLoginStatus();
});
