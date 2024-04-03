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

const checkAuth = () => {
	if (auth.currentUser === null) return window.location.replace(location.href.replace("profile", '') + "sign_in")
	id("settings").style = ''
	id("loading").remove()
	messages.off("value", checkAuth)
	
	settings.child(auth.getUid()).on("value", themeResult => {
		let theme = themeResult.val().theme
		
		setTheme(theme)
		
		sessionStorage.setItem("theme", theme)
	})
}

messages.on("value", checkAuth)

id("messages_button").addEventListener("click", () => window.location.replace("/"));

["profile"].forEach(tab => id(tab + "_button").addEventListener("click", () => window.location.replace("/" + tab)))

id("themeButton").addEventListener("click", function(){
	let themes = ["light", "dark", "light"]
	
	let names = [
		"Theme: Light",
		"Theme: Dark",
		"Theme: Light"
	]
	
	let index = names.indexOf(id("themeButton").innerHTML)
	index++
	index = themes.indexOf(themes[index])
	
	id("themeButton").innerHTML = names[index]
	
	let theme = themes[names.indexOf(id("themeButton").innerHTML)]
	
	setTheme(theme)
})

id("saveButton").addEventListener("click", function(){
	let themes = ["light", "dark", "light"]
	
	let names = [
		"Theme: Light",
		"Theme: Dark",
		"Theme: Light"
	]
	
	let theme = themes[names.indexOf(id("themeButton").innerHTML)]
	
	settings.child(auth.getUid()).child("theme").set(theme)
})

}()