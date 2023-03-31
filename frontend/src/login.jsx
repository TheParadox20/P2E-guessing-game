import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom';
import {baseURL} from './data.json'
import Footer from "./footer";

export default function Login(props){
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [email, setEmail] = useState('');
    let [DOB, setDOB] = useState('');
    let [pk, setPK] = useState('');
    let [view, setView] = useState(true);
    let [iskey, setIsKey] = useState('create');
    let navigate = useNavigate();

    let signup = async (e)=>{
        e.preventDefault();
        console.log(pk)
        fetch(baseURL+'signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CORS': 'Access-Control-Allow-Origin'
            },
            body: JSON.stringify({
                username: username,
                DOB: DOB,
                email: email,
                password: password,
                pk: pk
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.status=='success') setView(true)
            if(data.status=='error') alert(data.message)
        })
        .catch(err=>console.log(err))
    }

    let login = async (e)=>{
        e.preventDefault();
        fetch(baseURL+'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.status=='success'){//on successfull login
                localStorage.setItem('user', JSON.stringify({
                    address: data.user.address,
                    name: data.user.username,
                }));
                navigate('/transact')
            }else{
                document.getElementById('wrong').style.visibility='visible';
                document.getElementById('reset').style.visibility='visible';
            }
        })
        .catch(err=>console.log(err))
    }

    return(
        <div className="">
            {
                view?
                <div id='login' className="flex items-center h-screen flex-col justify-center">
                    <img src="" alt="" />
                    <p id="wrong" className="text-red-500 font-semibold text-md" style={{visibility:"hidden"}}>Incorrect Username or Password</p>
                    <form className=" text-black white md:w-1/3 py-8 px-4 flex flex-col justify-center">
                        <label className='block my-4' htmlFor="number">Username</label>
                        <input required className='block my-4 h-8 rounded-lg pl-4' placeholder="0791283746" value={username} onChange={event =>{setUsername(event.target.value)}}/>
                        <label className='block my-4' htmlFor="pass">Password</label>
                        <input required className='block my-4 h-8 rounded-lg pl-4' type="password" placeholder="Please enter password" value={password} onChange={event =>{setPassword(event.target.value)}}/>
                        <button onClick={(e)=>{login(e)}} className='bg-blue-500 block md:w-1/2 text-white py-2 rounded-xl'>Log In</button>
                    </form>
                    <p id="reset" className="text-red-500 my-2" style={{visibility:"hidden"}}>Try again or <Link to={'/recover'}>Recover Key</Link></p>
                    <p className="text-center">Don't have an account yet? <br /> <button onClick={(e)=>{setView(false)}} className="text-blue-500">Register an account</button></p>
                </div>
                :
                <div id='signup' className="flex items-center h-screen flex-col justify-center">
                    <img src="" alt="" />
                    <form className=" text-black white md:w-1/3 py-8 px-4">
                        <label className='block my-4' htmlFor="number">Username</label>
                        <input required className='block my-4 h-8 rounded-lg pl-4' type="text" placeholder="Jane Doe" value={username} onChange={event =>{setUsername(event.target.value)}}/>
                        <label className='block my-4' htmlFor="phone">Date of Birth</label>
                        <input required className='block my-4 h-8 rounded-lg pl-4' type="date" placeholder="" value={DOB} onChange={event =>{setDOB(event.target.value)}}/>
                        <label className='block my-4' htmlFor="email">Email</label>
                        <input className='block my-4 h-8 rounded-lg pl-4' type="email" placeholder="janedoe@gmail.com" value={email} onChange={event =>{setEmail(event.target.value)}}/>
                        <label className='block my-4' htmlFor="pass">Password</label>
                        <input required className='block my-4 h-8 rounded-lg pl-4' type="password" placeholder="********" value={password} onChange={event =>{setPassword(event.target.value)}}/>
                        <select className="block w-full my-4 h-8 rounded-lg pl-4" value={iskey} onChange={event =>{setIsKey(event.target.value);setPK('')}} >
                            <option value="create">Create new key</option>
                            <option value="import">Import key from wallet</option>
                        </select>
                        <input style={iskey=='create'?{'display':'none'}:{'display':''}} type="text" value={pk} className="block my-4 h-8 rounded-lg pl-4" onChange={event =>{setPK(event.target.value)}} placeholder="3bhja73212jkajdfjajkae3212jda0a78aa87"/>
                        <button onClick={(e)=>{signup(e)}} className='bg-blue-500 block w-full text-white py-2 rounded-lg'>Sign Up</button>
                    </form>
                    <p className="text-center mt-4">Have an account? <br /> <button onClick={(e)=>{setView(true)}} className="text-blue-500">Login</button></p>
                </div>
            }
            <Footer/>
            
        </div>
    )
}