import { useState } from "react";

export default function useCustomerRequest(){


const [

customerData,

setCustomerData

]

=

useState({

customer:{},

requirement:{},

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

previous=>(

{

...previous,

uploads:{

...previous.uploads,

[type]:files

}

}

)

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