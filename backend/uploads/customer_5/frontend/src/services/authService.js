const users=[

{

email:"admin@raas.com",

password:"admin123",

role:"Admin"

},

{

email:"sales@raas.com",

password:"sales123",

role:"Sales"

},

{

email:"ops@raas.com",

password:"ops123",

role:"Operations"

},

{

email:"customer@raas.com",

password:"cust123",

role:"Customer"

},

{

email:"manager@raas.com",

password:"manager123",

role:"Management"

}

]


export function loginUser(

email,

password,

role

){

return users.find(

user=>

user.email===email

&&

user.password===password

&&

user.role===role

)

}