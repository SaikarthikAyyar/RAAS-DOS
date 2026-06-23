import { useState } from "react";

import {loginUser}

from "../services/authService"

function Login() {

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [role,setRole]=useState("")

function handleLogin(){

const user=

loginUser(

email,

password,

role

)

if(user){

localStorage.setItem(

"userRole",

role

)

window.location.href=

"/dashboard"

}

else{

alert(

"Invalid credentials"

)

}

}

return (

<div>

<h1>Login</h1>

<br/>

<input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>

setEmail(

e.target.value

)}

 />

<br/><br/>

<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>

setPassword(

e.target.value

)}

 />

<br/><br/>

<select

value={role}

onChange={(e)=>

setRole(

e.target.value

)}

>

<option value="">

Select Role

</option>

<option>

Admin

</option>

<option>

Sales

</option>

<option>

Operations

</option>

<option>

Customer

</option>

<option>

Management

</option>

</select>

<button

onClick={handleLogin}

>

Login

</button>

</div>

)

}

export default Login;