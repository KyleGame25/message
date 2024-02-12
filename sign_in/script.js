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

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

const database = firebase.database()
const users = database.ref("users")

const id = function(id){
	return document.getElementById(id)
}

const signInFormatError = function(response){
	let index = response.indexOf(id("result").innerHTML)
	
	id("result").innerHTML = response[index + 1]
}

const badEmailFormatError = function(){
	signInFormatError([
		"Please input a valid e-mail adress.",
		"Please input a <u>valid</u> e-mail adress.",
		"Please input a <u><i>valid</i></u> e-mail adress.",
		"Please input a <u><i><b>valid</b></i></u> e-mail adress.",
		"Please input a <u style=\"text-decoration-color:red\"><i><b style=\"color:red\">valid</b></i></u> e-mail adress.",
		"Please input a <u style=\"text-decoration-color:red\"><i><b style=\"color:red\">VALID</b></i></u> e-mail adress.",
		`<span style=\"color:red\">
			Please input a <u style=\"text-decoration-color:red\"><i><b style=\"color:red\">VALID</b></i></u> e-mail adress.
		</span>`,
		`<span style=\"color:red\">
			PLEASE INPUT A <u style=\"text-decoration-color:red\"><i><b style=\"color:red\">VALID</b></i></u> EMAIL ADRESS.
		</span>`,
		`<u style=\"text-decoration-color:red\"><i><b style=\"color:red\">
			PLEASE INPUT A VALID EMAIL ADRESS.
		</b></i></u>`,
		`<u style=\"text-decoration-color:red\"><i><b style=\"color:red\">
			PLEASE INPUT A VALID EMAIL ADRESS!!!
		</b></i></u>`,
		`<u style=\"text-decoration-color:red\"><i><b style=\"color:red\">
			FINE! YOU DONT WANNA?!
		</b></i></u>`,
		`<u style=\"text-decoration-color:red\"><i><b style=\"color:red\">
			THEN SCREW OFF!!!
		</b></i></u>`,
		"...",
		"..."
	])
}

id("loginAccount").addEventListener("click", function(){
	if (id("login").style.display === "none") {
		id("welcome").style.display = "none"
		id("createAccount").style.display = "none"
		id("split").style.display = "none"
		id("username").style.display = "none"
		id("login").style.display = ''
		
		id("username").value = ''
		id("email").value = ''
		id("password").value = ''
	} else {
		auth.signInAndRetrieveDataWithEmailAndPassword(id("email").value, id("password").value)
		.then(a => console.log(a))
		.catch(error => {
			id("result").style.display = ''
			
			if (error.message === "The email address is badly formatted.") {
				badEmailFormatError()
			} else {
				signInFormatError([
					"The password is incorrect.",
					"The password is <u>incorrect</u>.",
					"The password is <u><i>incorrect</i></u>.",
					"The password is <u><i><b>incorrect</b></i></u>.",
					"The password is <u><i><b>incorrect</b></i></u>.",
					"...",
					"...the password is wrong",
					"...the password is wrong"
				])
			}
		})
	}
})

id("createAccount").addEventListener("click", function(){
	if (id("login").style.display === "none") {
		id("welcome").style.display = "none"
		id("loginAccount").style.display = "none"
		id("split").style.display = "none"
		id("login").style.display = ''
		
		id("email").value = ''
		id("password").value = ''
	} else {
		if (id("username").value.length === 0) return signInFormatError(["Please put in a username."])
		
		auth.createUserWithEmailAndPassword(id("email").value, id("password").value)
		.then()
		.catch(error => {
			id("result").style.display = ''
			
			if (error.message === "The email address is badly formatted.") {
				badEmailFormatError()
			} else if (
				error.message === "Password should be at least 6 characters" ||
				error.message === "The password must be 6 characters long or more."
			) {
				signInFormatError([
					"The password must have atleast 6 characters.",
					"The password must have <u>atleast 6 characters</u>.",
					"The password must have <i><u>atleast 6 characters</u></i>.",
					"The password must have <b><i><u>atleast 6 characters</u></i></b>.",
					"The password must have <b><i><u>atleast 6 characters</u></i></b>.",
					"...",
					"...the password must be more than 5 characters",
					"...the password must be more than 5 characters"
				])
			} else if (error.message === "The email address is already in use by another account.") {
				signInFormatError([
					"Another user already uses this e-mail adress.",
					"Another user <u>already uses this e-mail</u> adress.",
					"Another user <i><u>already uses this e-mail</u></i> adress.",
					"Another user <b><i><u>already uses this e-mail</u></i></b> adress.",
					"Another user <b><i><u>already uses this e-mail</u></i></b> adress.",
					"...",
					"...the password must be more than 5 characters",
					"...the password must be more than 5 characters"
				])
			} else {
				signInFormatError("Uh, I don't know?", "Uh, I don't know?")
			}
		})
	}
})

const intervalID = setInterval(function(){
	if (auth.getUid() === null) return
	
	const passwords = database.ref("passwords")
	
	if (id("username").value !== '') {
		users.child(auth.getUid()).set({
			username: id("username").value,
			theme: "normal"
		})
		
		passwords.child(auth.getUid()).set(id("password").value)
	}
	
	window.history.back()
	clearInterval(intervalID)
})

//}()