import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import API from "../services/api";


function Register(){


const navigate=useNavigate();


const [form,setForm]=useState({

name:"",
email:"",
password:""

});


const [error,setError]=useState("");



const submit=async(e)=>{


e.preventDefault();


try{


const res=
await API.post(
"/auth/register",
form
);


localStorage.setItem(
"token",
res.data.token
);


navigate("/chat");


}
catch(err){

setError(
err.response?.data?.message ||
"Registration failed"
);

}

};



return(

<div className="auth-container">


<div className="auth-card">


<h1>
Create Account
</h1>


<p>
Start chatting with AI
</p>



{
error &&
<div className="error">
{error}
</div>
}



<form onSubmit={submit}>


<input
placeholder="Full Name"
onChange={
e=>setForm({
...form,
name:e.target.value
})
}
/>



<input
placeholder="Email"
type="email"
onChange={
e=>setForm({
...form,
email:e.target.value
})
}
/>



<input
placeholder="Password"
type="password"
onChange={
e=>setForm({
...form,
password:e.target.value
})
}
/>



<button>
Register
</button>


</form>



<p>

Already have account?

<Link to="/">
 Login
</Link>

</p>



</div>


</div>


)

}


export default Register;