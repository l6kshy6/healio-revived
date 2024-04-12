import "./Home.css";
import {useState, useEffect, useRef} from "react";
import glass from "../../assets/glass.svg";
import messageQuestion from "../../assets/message_question.svg";

function Home(props){
    const inputRef = useRef(null);
    const ghostRef = useRef(null);
    const chatRef = useRef(null);
    const welcomeRef = useRef(null)
    const[testOutput,setTestOutput] = useState("");
    const[blank,setBlank] = useState("");
    const[clicked,setClicked] = useState(false);

    const resize = e=>{
        setBlank(e.target.value);
    };
    const clickQuestion = ()=>{
        setClicked(!clicked);
    };

    const submitInput = (e)=>{
        if(e.keyCode==13 && e.shiftKey==false){
            console.log(e.target.value);
            e.preventDefault();
            if(e.target.value!="")
                getData(e);
        }
    };

    const getData = (e)=>{
        fetch("http://localhost:5000/test", {
                method:"POST",
                body:e.target.value
            })
                .then(e => e.text())
                    .then(text=> {
                        console.log(text);
                        setTestOutput(text);
                        moveChatToTop();
                    });
    }

    const moveChatToTop = () =>{
        chatRef.current.style.paddingTop = "5vh";
        welcomeRef.current.style.display = "none";
    }

    useEffect(()=>{
        // console.log(ghostRef.current.offsetWidth);
        inputRef.current.style.width = ghostRef.current.offsetWidth+15+"px";
        inputRef.current.style.height = ghostRef.current.offsetHeight+"px";
    });
    return (
        <div>
            <div className="chat" ref={chatRef}>
                <h1 id="welcome" ref={welcomeRef} >Hello, {props.name}!</h1>
                <img className="messageQuestion" src={messageQuestion} onClick={clickQuestion}/>
                <div className="inputContainer">
                    <img id="glass" src={glass}/>
                    <textarea id="textInput" placeholder="How can we help you today?" style={{rows:1}} onInput={resize} ref={inputRef} onKeyDown={submitInput}></textarea>
                    <span id="ghost" ref={ghostRef}>{blank}</span>
                </div>
            </div>
            {clicked && 
                    <div id="legalNotice">
                    <img className="messageQuestion" id="questionNotice" src={messageQuestion}/>
                    <h6>This chat is powered with our custom-trained AI Model. The suggestions have not been evaluated by a medical professional.</h6>
                    </div> }
            <div className="output">
                    {testOutput!="" &&
                    <p>{testOutput}</p>
                    }
            </div>
        </div>
    );
}
export default Home;