import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import API from "../services/api";


function Login(){

const navigate=useNavigate();


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [error,setError]=useState("");



const submit=async(e)=>{

e.preventDefault();

try{

const res=await API.post("/auth/login",{
email,
password
});


localStorage.setItem(
"token",
res.data.token
);


navigate("/chat");


}
catch(err){

setError(
err.response?.data?.message ||
"Login failed"
);

}

};



return(

<div className="auth-container">


<div className="auth-card">


<h1>
Welcome Back
</h1>


<p>
Login to your AI Assistant
</p>


{
error &&
<div className="error">
{error}
</div>
}



<form onSubmit={submit}>


<input
placeholder="Email"
type="email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>


<input
placeholder="Password"
type="password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>


<button>
Login
</button>


</form>



<p>

New user?

<Link to="/register">
 Create account
</Link>

</p>


</div>


</div>

)

}


export default Login;