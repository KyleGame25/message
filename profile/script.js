void function(){

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

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

const database = firebase.database()
const messages = database.ref("messages")
const userDatabase = database.ref("usernames")
const settings = database.ref("settings")

const id = id => document.getElementById(id)

const setTheme = theme => {
	let colors = {
		light: ["#B5FFE1", "#93E5AB", "#65B891", "#00241B", "#B5FFE1", "#B5FFE1"],
		dark: ["#233F3E", "#478171", "#325A55", "#C5FFEF", "#C5FFEF", "#233F3E"]
	}
	
	let root = document.documentElement
	
	root.style.setProperty("--background-color", colors[theme][0]);
	root.style.setProperty("--primary-color", colors[theme][1]);
	root.style.setProperty("--secondary-color", colors[theme][2]);
	root.style.setProperty("--text-color", colors[theme][3]);
	root.style.setProperty("--inset-color", colors[theme][4]);
	root.style.setProperty("--select-color", colors[theme][5]);
}

if (sessionStorage.getItem("theme") !== null) setTheme(sessionStorage.getItem("theme"))

const checkAuth = function(){
	if (auth.currentUser === null) return window.location.replace("sign_in")
	id("profile_buttons").style = ''
	id("loading").remove()
	messages.off("value", checkAuth)
	
	settings.child(auth.getUid()).on("value", themeResult => {
		let theme = themeResult.val().theme
		
		setTheme(theme)
		
		sessionStorage.setItem("theme", theme)
	})
}

messages.on("value", checkAuth)

userDatabase.on("value", userResult => {
	let username = userResult.val()[auth.getUid()]
	
	id("username").removeAttribute("disabled")
	id("username").value = username
	id("options").style = ''
	id("email").textContent = auth.currentUser.email
})

id("messages_button").addEventListener("click", () => window.location.replace("/message"));

["settings"].forEach(tab => id(tab + "_button").addEventListener("click", () => window.location.replace(window.location.pathname.replace("profile", tab))))

id("saveButton").addEventListener("click", () => {
	if (id("username").value.length !== 0) userDatabase.child(auth.getUid()).set(id("username").value)
})

id("logoutAccount").addEventListener("click", auth.signOut)

document.addEventListener("mousemove", event => {
	if (id("flashlight") === null) return
	id("flashlight").style.left = event.pageX + "px";
	id("flashlight").style.top = event.pageY + "px";
})

setInterval(() => {
	if (id("username").value.length !== 0) id("saveButton").style = ''
	else id("saveButton").style = `
		background-color: #e59393;
		border-color: #b86565;
		color: #240000;
		box-shadow: #b86565 0 0.15rem;
		transform: translateY(0rem);
		cursor: not-allowed;`
}, 50)

}()