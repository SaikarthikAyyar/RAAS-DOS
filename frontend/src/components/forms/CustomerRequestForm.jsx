import {useState} from "react"

export default function CustomerRequestForm({onSubmit}){

const [customer,setCustomer]=useState("")

const [contact,setContact]=useState("")

const [phone,setPhone]=useState("")

const [location,setLocation]=useState("")

const submit=()=>{

onSubmit({

id:Date.now(),

customer,

contact,

phone,

location,

survey:null,

ops:null,

quote:null,

approval:null,

allocation:null,

execution:null,

status:"REQUESTED"

})

}

return(

<>

<input

placeholder="Customer"

value={customer}

onChange={(e)=>setCustomer(e.target.value)}

/>

<br/>

<input

placeholder="Contact"

value={contact}

onChange={(e)=>setContact(e.target.value)}

/>

<br/>

<input

placeholder="Phone"

value={phone}

onChange={(e)=>setPhone(e.target.value)}

/>

<br/>

<input

placeholder="Location"

value={location}

onChange={(e)=>setLocation(e.target.value)}

/>

<br/>

<button onClick={submit}>

Create Request

</button>

</>

)

}