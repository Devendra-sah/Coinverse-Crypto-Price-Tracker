  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCOo_HjEFowv2pAJI_wCkyEJtrGV4e6SIk",
    authDomain: "coinverse-18a1b.firebaseapp.com",
    projectId: "coinverse-18a1b",
    storageBucket: "coinverse-18a1b.firebasestorage.app",
    messagingSenderId: "694634733070",
    appId: "1:694634733070:web:493019f6e9cbb746d9e65f"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const submit = document.getElementById("submit");
  submit.addEventListener("click", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth(app);
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password, username)
      .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      alert("User created successfully");
      window.location.href = "login.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Error: " + errorMessage);
    // ..
  });
  })