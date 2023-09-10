
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore,setDoc,doc,  getDocs,
    query,
    where,} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getStorage} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
  
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBu9Dkm_cV6GqnSZqxRbONwL9J4r08HjYU",
    authDomain: "trying-7df5e.firebaseapp.com",
    projectId: "trying-7df5e",
    storageBucket: "trying-7df5e.appspot.com",
    messagingSenderId: "85081642300",
    appId: "1:85081642300:web:0f7ac71ae6dda94059fa39",
    measurementId: "G-6ZRGYLB3YK"
  };
  const app = initializeApp(firebaseConfig);
  
  const db = getFirestore(app);
  const auth = getAuth();
  const storage = getStorage();
  
  const signup = async () => {
      // Get user input values
      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const email = document.getElementById("signup_email").value;
      const password = document.getElementById("signup_password").value;
      const repeatpassword = document.getElementById("signup_repeatpassword").value;
  
      if (password !== repeatpassword) {
          alert("Password doesn't match");
          return;
      }
  
      try {
          // Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
  
            // Upload the file to Firebase Storage
        //   const file = document.getElementById("image").files[0];
        //   const storageRef = ref(storage, `user-files/${user.uid}/${file.name}`);
        //   await uploadBytes(storageRef, file);
  
          // Save user data in Firestore
          await setDoc(doc(db, "users", user.uid), {
              firstname,
              lastname,
              email,
              password,
              repeatpassword,
              uid: user.uid,
              admin:true,
          });
          alert("Successfully signed up", user);
          window.location.href="homepage.html"
          

      } catch (error) {
          console.error("Sign-up error:", error);
          alert("Sign-up failed. Please check your input.");
      }
  };
  
  const login = async () => {
      const email = document.getElementById("login_email").value;
      const password = document.getElementById("login_password").value;
  
      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          if(email=="amnanehal963@gmail.com"&& password=="AmnaNehal"){
          alert("Successfully Login", userCredential);
          window.location.href="admin.html"}
          else{
            window.location.href="signup.html"
          }
          
    
  
          // Retrieve and display the user's uploaded image
        //   const user = userCredential.user;
        //   const storageRef = ref(storage, `user-files/${user.uid}/file.png`); // Modify the file name as needed
        //   const url = await getDownloadURL(storageRef);
        //   const img = document.getElementById('myimg');
        //   img.setAttribute('src', url);
      } catch (error) {
          alert("Login failed: " + error.message);
      }
  };
  
  const signup_btn = document.getElementById("signup-btn");
  const login_btn = document.getElementById("login-btn");
  
  if (signup_btn) {
      signup_btn.addEventListener("click", signup);
  } else if (login_btn) {
      login_btn.addEventListener("click", login);

  }
  
 

 //admin.html
  // Function to create a class
  document.getElementById("create").addEventListener("click", async () => {
    try {
      const classData = {
        classTimings: document.getElementById("classTimings").value,
        schedule: document.getElementById("schedule").value,
        teacherName: document.getElementById("teacherName").value,
        sectionName: document.getElementById("sectionName").value,
        courseName: document.getElementById("courseName").value,
        batchNumber: document.getElementById("batchNumber").value,
      };
  
      // Add the class data to Firestore
      const docRef = await setDoc(doc(db, "classes", classData), classData);
      console.log("Class created with ID: ", docRef.id);
    } catch (error) {
      console.error("Error creating class: ", error);
    }
  });
  
  // Function to read class data (for demonstration purposes)
  document.getElementById("read").addEventListener("click", async () => {
    try {
      const classQuery = query(
        db,
        "classes",
        where("courseName", "==", "Web development")
      );
  
      const querySnapshot = await getDocs(classQuery);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error reading class data: ", error);
    }
  });
  
  // Function to upload an image
  document.getElementById("image").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`);
  
    try {
      await uploadBytes(storageRef, file);
      console.log("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  });
  
  // Function to create a student
  document.getElementById("created").addEventListener("click", async () => {
    try {
      const studentData = {
        name: document.getElementById("Stud_name").value,
        fatherName: document.getElementById("father_name").value,
        rollNumber: document.getElementById("rollno").value,
        contactNumber: document.getElementById("contact").value,
        cnic: document.getElementById("cnic").value,
        picture: "URL_of_uploaded_image", // Replace with the actual URL of the uploaded image
        courseName: document.getElementById("courses").value,
        adminAssigningClass: document.getElementById("asign").value,
      };
  
      // Add the student data to Firestore
      const docRef = await setDoc(doc(db, "students", studentData), studentData);
      console.log("Student created with ID: ", docRef.id);
    } catch (error) {
      console.error("Error creating student: ", error);
    }
  });

  //homepage
 

document.getElementById("submitAttendance").addEventListener("click", () => {
    const rollNumber = document.getElementById("rollNumber").value;
    const attendanceStatus = document.getElementById("attendanceStatus").value;
    const adminPassword = document.getElementById("adminPassword").value;

    // Check if attendanceStatus is "Late" and validate admin password
    if (attendanceStatus === "Late") {
        markAttendance(rollNumber, "Late");
    } else if (attendanceStatus === "Leave" || attendanceStatus === "Absent") {
        

        // Mark as Leave or Absent
        markAttendance(rollNumber, attendanceStatus);
    } else {
        // Mark as Present
        markAttendance(rollNumber, "Present");
    }
});

// Function to mark attendance and store in Firebase
function markAttendance(rollNumber, status) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    db.collection("attendance").add({
        rollNumber: rollNumber,
        status: status,
        timestamp: timestamp
    })
    .then(() => {
        alert(`Attendance marked as ${status} for Roll Number ${rollNumber}`);
        document.getElementById("rollNumber").value = "";
    })
    .catch((error) => {
        console.error("Error marking attendance:", error);
        alert("Error marking attendance. Please try again.");
    });
}

// Function to retrieve and display student statistics
function displayStudentStatistics() {
    db.collection("attendance")
        .orderBy("timestamp", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
            const attendanceHistory = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                attendanceHistory.push(`${data.rollNumber}: ${data.status}`);
            });

            document.getElementById("attendanceHistory").textContent = "Attendance History: " + attendanceHistory.join(", ");
        })
        .catch((error) => {
            console.error("Error retrieving student statistics:", error);
        });
}

// Display student statistics on page load
displayStudentStatistics();

  