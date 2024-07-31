import "./Home.css";
import {useState, useEffect, useRef} from "react";
import glass from "../../assets/glass.svg";
import messageQuestion from "../../assets/message_question.svg";
import "react-markdown";
import Markdown from "react-markdown";
import OpenAI from "openai";

function Home(props){
    const inputRef = useRef(null);
    const ghostRef = useRef(null);
    const chatRef = useRef(null);
    const welcomeRef = useRef(null)
    const[testOutput,setTestOutput] = useState("");
    const[blank,setBlank] = useState("");
    const[clicked,setClicked] = useState(false);
    const [errortext,setErrorText] = useState("");

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

    // const fetchPriceData = ndc =>{
    //     fetch("https://data.medicaid.gov/api/1/datastore/query/99315a95-37ac-4eee-946a-3c523b4c481e/0",{
    //         method:"POST",
    //         body: JSON.stringify({
    //             "conditions": [
    //               {
    //                 "resource": "t",
    //                 "property": "ndc",
    //                 "value": 24385005452,
    //                 "operator": "="
    //               },
    //               {
    //                 "resource": "t",
    //                 "property": "OTC",
    //                 "value": "Y",
    //                 "operator": "="
    //               }
    //             ],
    //             "limit": 3
    //           })
    //     }).then(e => e.json())
    //     .then(json=> {
    //         console.log(json.results[0].nadac_per_unit);
    //     });
    // }
    // console.log(import.meta.env.VITE_OPENAI_KEY);

    const getData = (e)=>{
        // Fetches response from GEMINI first
        fetch("https://healio-revived.onrender.com/test", {
                method:"POST",
                body:e.target.value
            })
                .then(e => e.text())
                    .then(text=> {
                        console.log(text);
                        if(text=="illegible_response")
                            setErrorText("Please enter a valid response.");
                        else {    
                        setTestOutput(text);
                        moveChatToTop();
                        }
                    });
    }
    
    async function createThread(){
        const openai = new OpenAI({apiKey:import.meta.env.VITE_OPENAI_KEY});
        console.log("creating thread");
        const thread = await openai.beta.threads.create();
        console.log(thread);
        return thread;
    }

    async function createMessage(thread, input){
        const message = await openai.beta.messages.create(thread.id,{role:"user",content:input})
        return message;
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
                <h1 id="welcome" ref={welcomeRef} >Good evening, {props.name}!</h1>
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
                    <Markdown>{testOutput}</Markdown>
                    }
            </div>
        </div>
    );
}
export default Home;