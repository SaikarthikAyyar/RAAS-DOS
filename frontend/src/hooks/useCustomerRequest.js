import { useState } from "react";

export default function useCustomerRequest(){


const [

customerData,

setCustomerData

]

=

useState({

customer:{},

requirement:{cleaning_date: "",

cleaning_frequency: ""},

uploads:{}

});


const updateSection=(

section,

field,

value

)=>{


setCustomerData(

previous=>(

{

...previous,

[section]:{

...previous[section],

[field]:value

}

}

)

);

};


const updateMedia=(

type,

files

)=>{

setCustomerData(

previous=>{

const existing=

previous.uploads[type] || [];


const combined=[

...existing,

...files

];


const unique=combined.filter(

(file,index,self)=>

index===self.findIndex(

f=>

f.name===file.name

&&

f.size===file.size

)

);


return{

...previous,

uploads:{

...previous.uploads,

[type]:unique

}

};

}

);

};

const counts={

photos:

customerData.uploads.photos?.length || 0,

videos:

customerData.uploads.videos?.length || 0,

layouts:

customerData.uploads.layouts?.length || 0

};


return{

customerData,

setCustomerData,

updateSection,

updateMedia,

counts

};

}