//void function(){

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
	if (auth.getUid() === null) return window.open("sign_in", "_self")
	document.body.style = ''
	isAuth = () => {}
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

const database = firebase.database()
const userDatabase = database.ref("users")
const messages = database.ref("messages")

const usernames = []

userDatabase.on("value", function(userResult){
	let users = userResult.val()
	
	for (let userID in users) usernames[userID] = users[userID].username
})

let lastTick = Date.now()
let waitTime = 0
let notifications = 0

let playNotification = function(){}

const id = function(id){
	return document.getElementById(id)
}

const screen = {
	state: "welcome"
}

const getMessage = function(){
	let message = id("message_input").innerHTML
	message = message.replaceAll("</div><div>", "\n")
	
	let div = document.createElement("div")
	div.style.display = "none"
	div.innerHTML = message
	
	document.body.appendChild(div)
	message = div.innerText
	
	div.remove()
	
	message = message.replaceAll(/\n+/g, "\n")
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
	
	fetch(url).then(response => {
		if (response.status > 399) return
		
		messages.push({
			user: auth.getUid(),
			time: Date.now(),
			type: "image",
			content: message
		})
		
		waitTime += 3000
		id("message_input").innerHTML = ''
	})
})

id("message_send").addEventListener("click", function(){
	if (getMessage().length === 0 || getMessage().length > 200 || waitTime !== 0) return
	
	messages.push({
		user: auth.getUid(),
		time: Date.now(),
		type: "message",
		content: getMessage()
	})
	
	waitTime += 2000
	id("message_input").innerHTML = ''
})

messages.on("value", function(messageResult){
	setTimeout(function(){
		playNotification = function(){
			let audio = new Audio()
			audio.src = "notification.wav"
			audio.play()
		}
	}, 1000)
	
	id("messages").innerHTML = ''
	let messages = messageResult.val()
	
	for (let messageID in messages) {
		let div = document.createElement("div")
		let message = messages[messageID]
		
		let username = usernames[message.user]
		if (username === undefined) username = "???"
		
		if (message.type === "image") {
			let img = new Image(256)
			img.src = message.content
			img.style = "border: 0.1rem solid #65B891; border-radius: 0.1rem; cursor: alias"
			img.loading = "lazy"
			
			img.addEventListener("click", () => window.open(message.content))
			
			div.innerText = username + ": "
			div.appendChild(img)
			div.appendChild(document.createElement("br"))
		} else {
			div.innerText = username + ": " + message.content + "\n"
		}
		
		id("messages").appendChild(div)
	}
})

messages.on("child_added", function(messageResult){
	isAuth()
	
	if (messageResult.val().user === auth.getUid()) return
	playNotification()
	
	if (id("messages").scrollTopMax - id("messages").scrollTop < 500) id("messages").scrollTop = 0x7FFFFFFF
	
	if (!document.hasFocus()) notifications++
})

setInterval(function(){
	let diff = Date.now() - lastTick
	lastTick = Date.now()
	
	if (waitTime > 0) waitTime -= diff
	if (waitTime < 0) waitTime = 0
	
	let message = getMessage()
	
	if (message.length > 0 && message.length <= 200 && waitTime === 0) id("message_send").style = ''
	else id("message_send").style = `
		background-color: #e59393;
		border-color: #b86565;
		box-shadow: #b86565 0 0.15rem;
		transform: translateY(0rem);
		cursor: not-allowed;`
	
	try {
		new URL(message)
		if (message.length > 200 || waitTime !== 0) throw Error()
		id("image_send").style = ''
	} catch (e) {
		id("image_send").style = `
		background-color: #e59393;
		border-color: #b86565;
		box-shadow: #b86565 0 0.15rem;
		transform: translateY(0rem);
		cursor: not-allowed;`
	}
	
	if (document.hasFocus()) notifications = 0
	
	if (notifications === 0) document.title = "KG25 Messages!"
	else document.title = "(" + notifications + ") KG25 Messages!"
	
	id("messages").style.bottom = (id("message_input").clientHeight + 32) + "px"
})

//}()