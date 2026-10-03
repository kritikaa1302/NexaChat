import { useNavigate } from "react-router-dom";


function Navbar() {

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };


    return (

        <nav
        style={{
            display:"flex",
            justifyContent:"space-between",
            padding:"15px",
            background:"#222",
            color:"white"
        }}
        >

            <h3>
                AI Chatbot
            </h3>


            <button onClick={logout}>
                Logout
            </button>


        </nav>

    );

}


export default Navbar;