const firebaseConfig = {
	apiKey: "AIzaSyDyrY6NSnQxLR_2rAJxDIAyMmJkzwsJiU8",
	authDomain: "fir-test-81376134.firebaseapp.com",
	databaseURL: "https://fir-test-81376134-default-rtdb.firebaseio.com",
	projectId: "fir-test-81376134",
	storageBucket: "fir-test-81376134.appspot.com",
	messagingSenderId: "823817099212",
	appId: "1:823817099212:web:b48cdb8578ec454403af69",
	measurementId: "G-QM8TBEGHND"
};

let isAuth = function(){
	if (auth.getUid() === null) return window.open(location.href.replace("profile", '') + "sign_in", "_self")
	document.body.style = ''
	isAuth = () => {}
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

const database = firebase.database()
const messages = database.ref("messages")
const userDatabase = database.ref("users")

messages.on("value", isAuth)

userDatabase.on("value", function(userResult){
	let username = userResult.val()[auth.getUid()].username
	
	id("username").value = username
	id("email").textContent = auth.currentUser.email
})

const id = function(id){
	return document.getElementById(id)
}

id("saveButton").addEventListener("click", function(){
	if (id("username").value.length === 0) return
	userDatabase.child(auth.getUid()).child("username").set(id("username").value)
})

id("logoutAccount").addEventListener("click", auth.signOut)

setInterval(function(){
	if (id("username").value.length !== 0) id("saveButton").style = ''
	else id("saveButton").style = `
		background-color: #e59393;
		border-color: #b86565;
		color: #240000;
		box-shadow: #b86565 0 0.15rem;
		transform: translateY(0rem);
		cursor: not-allowed;`
})

//}