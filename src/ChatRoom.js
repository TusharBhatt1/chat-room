import React, { useEffect, useRef, useState } from 'react'
import "./App.css"
import {getDatabase, ref,push,set ,onChildAdded} from "firebase/database"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {v4 as uuidv4} from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GoogleIcon from '@mui/icons-material/Google';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RotateRightIcon from '@mui/icons-material/RotateRight';

export default function ChatRoom() {


  
  const db = getDatabase();
  const chatListRef = ref(db, 'chats');

  let containerRef = useRef()
   
  let [name,setName] = useLocalStorage("name","")
  let [photo, setPhoto] = useLocalStorage("photo","")
  let [isAuth, setIsAuth] =useLocalStorage("isAuth",false)
  let [chats, setChats]= useState([])
  let [isLoading, setIsloading] =useState(false)


  let [msg , setMsg] = useState("")
  let date = new Date()
 
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  
//  Goggle SignIn
  const googleSignIn=()=>{ setIsloading(true)
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
  
      const user = result.user;
     
      setIsAuth(true)
      setName(user.displayName)
      setPhoto(user.photoURL)
     
    
    }).catch((error) => {
  
      const errorCode = error.code;
      const errorMessage = error.message;
     
      const email = error.customData.email;

      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    })}



  useEffect(()=>{
    
    onChildAdded(chatListRef,(data)=>{

    
      setChats((chats)=>{
       const newChat = data.val()

       const duplicateChat = chats.some((prev)=>prev.id===newChat.id)

       if(duplicateChat) return chats
       return [...chats, newChat]

        
        })
        setTimeout(()=>{
          updateScroll()
        },100)
      
      
    })
  
  },[])


  // Send Message
  const sendMsg=()=>{
    
    if (msg)
    {
      const chatRef = push(chatListRef);
      set(chatRef, {
        id:uuidv4(), name:name, message: msg , time : date.getDate()+ "/"+(date.getMonth()+1) + "/" + date.getFullYear() +" at " +date.getHours() +":" +(date.getMinutes().toString().padStart(2,"0"))

       });
    setMsg("")
    }
   
  }

 // Update Scroll on new message
  const updateScroll=()=>{
    if(containerRef.current)
    {containerRef.current.scrollTop = containerRef.current.scrollHeight}
  }


  // Delete Message
  const deleteMessage=(id)=>{

   let newChats=chats.filter((chat)=>chat.id!== id)
  
   console.log("newchats:",newChats)

   setChats(newChats)
  
  }


 if(!isAuth)
 {
  return (
    <div className='  text-white h-screen flex justify-center items-center'>
    <div className=' rounded-lg flex flex-col justify-center items-center text-center p-4 gap-8 sm:gap-12'>
    <p className=' text-2xl sm:text-4xl font-bold '>Chat Room App</p>
     <button className='border-2 border-blue-500 rounded-xl h-12 p-2 bg-blue-700 text-white  hover:bg-blue-800' onClick={googleSignIn} >Sign in with <GoogleIcon/>
    { isLoading && <RotateRightIcon className='animate-spin text-white'/>}</button>
     <p className='text-xs text-slate-500'>To maintain trust, privacy, and control <br/> over valuable resources this step is important.</p>
     <span className='text-lg'>Creator :<br/><span className=' font-extrabold text-blue-500 text-xl'> Mr. Tushar Bhatt  <a href="https://www.linkedin.com/in/tushar-bhatt-59b64623b" target="_blank" rel="noreferrer">
       <LinkedInIcon  className=""/>
       </a></span>  </span>
     
     </div>

     </div>
  )
 }


  return (
    <div className='p-2 sm:p-4 bg-blue-700'>
    { isAuth &&  <div>
      <div className='flex justify-between items-center text-center '>
     <h1 className='text-sm font-bold text-white '>Hey, <br/> <strong className='font-extrabold'> {name}</strong></h1>
    <a className='text-sm font-bold text-pink-300' href="https://myportfolio-ten-inky.vercel.app/" target="_blank" rel="noreferrer">
     Connect : <DashboardIcon className='text-white'/></a>
     <img src={photo} className='h-8 w-8 rounded-full' alt={name}/>
     </div>

    <div className='p-2'>
   
     <div ref={containerRef} className='chat-container bg-black mt-4 border-2 h-72 sm:h-96 p-2 overflow-y-scroll border-black'>
      {chats && chats.map((c)=> <div key={c.id} className={`container m-auto  ${c.name===name ? "me":""}`}>
      <div>
      {c.name===name ? <img src={photo} alt={name} className=' my-2 h-5 rounded-full'/>
      :<p className='text-white text-xs my-2'>{c.name} :</p>}

        <div className='chatbox  rounded bg-blue-700 text-white p-2'>
          <strong className='text-xs sm:text-sm flex flex-wrap overflow-scroll truncate whitespace-normal '> {c.message}</strong>
          <span className='flex gap-2 mt-2'>
          <div className='flex flex-col gap-2 sm: justify-center items-center'>
          <p className='text-xs text-slate-300'>{c.time}</p>
          {c.name===name && <button className='text-xs text-black text-slate-400' onClick={()=>deleteMessage(c.id)}>Delete</button>}
          </div>
          </span>
        </div>
      </div>
      </div>)
     }
     </div>
     </div>
    <div className='fixed bottom-2  flex ml-2 gap-2 items-center'>
      <input value={msg} className=' p-1 h-8 sm:h-12 rounded-lg grow border-2 border-black' type="text" onChange={(e)=>setMsg(e.target.value)} placeholder=' Enter Message'/>
      <button className=' border-2 text-white p-1 rounded-lg hover:bg-blue-500 ' onClick={sendMsg}>Send</button>
    </div>
    </div>
    }
    </div>
  )
}

