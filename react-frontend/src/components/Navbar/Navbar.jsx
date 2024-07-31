import "./Navbar.css";
import Home from "../Home/Home";
import {Routes, Route, Link} from "react-router-dom";
import {useState} from "react";


function Navbar(){
    const [name, setName] = useState("Lakshya");

    return (
        <div>
        <nav>
            <Link to="/" className="link">Heal<span id="dot">.</span>io</Link>
        </nav>
        <Routes>
            <Route path="/" element={<Home name={name}/>}></Route>
        </Routes>
        </div>
    );
}

export default Navbar;