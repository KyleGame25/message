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
const userDatabase = database.ref("usernames")
const messages = database.ref("messages")
const settings = database.ref("settings")

const usernames = {}

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
	if (auth.currentUser === null) return window.open("sign_in", "_self")
	id("messages").style = ''
	id("message_box").style = ''
	id("loading").remove()
	messages.off("value", checkAuth)
	
	setTimeout(() => id("messages").scrollTop = 0x7FFFFFFF)
	
	settings.child(auth.getUid()).on("value", themeResult => {
		let theme = themeResult.val().theme
		
		setTheme(theme)
		
		sessionStorage.setItem("theme", theme)
	})
}

const displayDate = time => {
	let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][time.getMonth()]
	
	return month + ". " + time.getDate() + ", " + time.getFullYear()
}

const displayFullTime = time => {
	let minutes = String(time.getMinutes())
	let seconds = String(time.getSeconds())
	
	if (minutes.length === 1) minutes = "0" + minutes
	if (seconds.length === 1) seconds = "0" + seconds
	
	return displayDate(time) + " " + time.getHours() + ":" + minutes + ":" + seconds
}

const displayMessages = messageResult => {
	setTimeout(function(){
		playNotification = function(){
			let audio = new Audio()
			audio.src = "notification.wav"
			audio.play()
		}
	}, 100)
	
	id("messages").innerHTML = ''
	let messages = messageResult.val()
	
	let previousUsername = null
	
	let tickPerHour = 3600000
	let tickPerDay = tickPerHour * 24
	
	let wallDiv = document.createElement("div")
	let usernameDiv
	let timeDiv
	let previousTime
	let seperator
	let createDayDiv = false
	
	for (let messageID in messages) {
		let div = document.createElement("div")
		let message = messages[messageID]
		
		let username = usernames[message.user]
		if (username === undefined) username = "???"
		
		createDayDiv = Math.floor(previousTime / tickPerDay) < Math.floor(message.time / tickPerDay)
		
		if (previousUsername !== username || previousTime + tickPerHour < message.time) {
			id("messages").appendChild(wallDiv)
			
			wallDiv = document.createElement("div")
			usernameDiv = document.createElement("div")
			timeDiv = document.createElement("div")
			
			wallDiv.classList.add("messageWall")
			
			usernameDiv.innerText = username
			usernameDiv.classList.add("username")
			wallDiv.appendChild(usernameDiv)
			
			timeDiv.innerText = displayFullTime(new Date(message.time))
			timeDiv.classList.add("date")
			wallDiv.appendChild(timeDiv)
			
			seperator = document.createElement("div")
			seperator.style.height = "0.4rem"
			seperator.style.opacity = 0
			seperator.innerText = "\n"
			wallDiv.appendChild(seperator)
		}
		
		previousUsername = username
		previousTime = message.time
		
		div.classList.add("message")
		
		if (message.type === "image") {
			let img = new Image()
			img.src = message.content
			img.style = "border: 0.1rem solid #65B891; border-radius: 0.1rem; cursor: alias; width: 16rem"
			img.loading = "lazy"
			
			img.addEventListener("click", () => window.open(message.content))
			
			div.appendChild(img)
		} else if (message.type === "text") {
			div.innerText = message.content
		}
		
		wallDiv.appendChild(div)
		
		if (createDayDiv) {
			let dayDiv = document.createElement("div")
			
			dayDiv.classList.add("messageSeperatorDay")
			dayDiv.innerText = displayDate(new Date(message.time))
			
			id("messages").appendChild(dayDiv)
		}
	}
	
	id("messages").appendChild(wallDiv)
	
	if (id("messages").scrollTopMax - id("messages").scrollTop < 500) id("messages").scrollTop = 0x7FFFFFFF
}

userDatabase.on("value", userResult => {
	let users = userResult.val()
	
	for (let userID in users) usernames[userID] = users[userID]
	
	messages.on("value", displayMessages)
})

messages.on("value", checkAuth)

let lastTick = Date.now()
let waitTime = 0
let notifications = 0

let playNotification = function(){}

const getMessage = function(){
	let message = id("message_input").value
	
	message = message.replaceAll("\u202e", '')
	
	if (message[0] === "\n") message = message.substr(1)
	if (message.at(-1) === "\n") message = message.slice(0, -1)
	
	return message
}

id("image_send").addEventListener("click", function(){
	let message = getMessage()
	if (message.length > 200 || waitTime !== 0) return
	let url
	
	try {
		url = new URL(message)
	} catch {
		return
	}
	
	fetch(url).then(
		response => response.status > 399 ? response.blob() : null
	).then(response => {
		if (response === undefined || response.type.substr(0, 5) === "image") return
		
		messages.push({
			user: auth.getUid(),
			time: Date.now(),
			type: "image",
			content: message
		})
		
		waitTime += 3000
		id("message_input").value = ''
	})
})

id("message_send").addEventListener("click", function(){
	if (getMessage().length === 0 || getMessage().length > 200 || waitTime !== 0) return
	
	messages.push({
		user: auth.getUid(),
		time: Date.now(),
		type: "text",
		content: getMessage()
	})
	
	waitTime += 2000
	id("message_input").value = ''
});

["profile", "settings"].forEach(tab => id(tab + "_button").addEventListener("click", () => window.location.replace(tab)))

messages.on("child_added", messageResult => {
	if (messageResult.val().user === auth.getUid()) return
	playNotification()
	
	if (!document.hasFocus()) notifications++
})

let previousInput = undefined

const updateSendIcons = function(){
	let message = getMessage()
	
	if (message.length > 0 && message.length <= 200 && waitTime === 0) id("message_send").style = ''
	else fail("message_send")
	
	try {
		let url = new URL(message)
		if (message.length > 200 || waitTime !== 0) throw Error()
		
		fetch(url).then(response => {
			if (response.status < 400) return response.blob()
			fail("image_send")
		}).then(response => {
			if (response === undefined || response.type.substr(0, 5) !== "image") return fail("image_send")
			id("image_send").style = ''
			previousInput = message
		})
	} catch (e) {
		fail("image_send")
	}
	
	function fail(elm){
		previousInput = message
		
		id(elm).style = `
		background-color: #e59393;
		border-color: #b86565;
		box-shadow: #b86565 0 0.15rem;
		transform: translateY(0rem);
		cursor: not-allowed;`
	}
}

setInterval(() => {
	let diff = Date.now() - lastTick
	lastTick = Date.now()
	
	if (waitTime > 0) waitTime -= diff
	if (waitTime < 0) waitTime = 0
	
	if (document.hasFocus()) notifications = 0
	
	if (notifications === 0) document.title = "KG25 Messages!"
	else if (auth.getUid() === null) document.title = "KG25 Messages!"
	else document.title = "(" + notifications + ") KG25 Messages!"
	
	id("messages").style.bottom = (id("message_input").clientHeight + 32) + "px"
})

setInterval(() => previousInput === getMessage() ? null : updateSendIcons(), 1000)

}()