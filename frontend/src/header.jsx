import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {baseURL} from './data.json'
import metamask from './assets/metamask.png'
import ace from './assets/ace.png'
import Login from "./login";

export default function Header(){
    let navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));
    let [network, setNetwork] = useState('mumbai');
    let [balance, setBalance] = useState(user.balance);
    let [connected, setConnected] = useState(false);

    let getBalance = ()=>{
        console.log('getting balance')
        fetch(baseURL+'balance').then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.status=='success'){
                setBalance(data.balance)
            }
        }
        )
    }
    let switchNetwork = (network)=>{
        fetch(baseURL+'network', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                network: network
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.status=='success'){
                setBalance(data.balance)
            }
        }
        )
    }
    let logout = (e)=>{
        e.preventDefault();
        //fetch logout method get
        fetch(baseURL+'logout', {}).then(res=>res.json())
        .then(data=>{
            if(data.status=='success'){
                alert('logged out')
            }
        })
        .catch(err=>console.log(err))

        localStorage.setItem('user', JSON.stringify({
        }))
        navigate('/');
    }
    //get balance every 5 seconds
    setInterval(()=>{
        connected?getBalance():null;
    }, 60000*0.1)

    return(
        <>
        <header className="text-lg py-4">
            {
                connected?
                <>
                    <div className="w-full flex flex-col-reverse justify-center md:flex-row md:justify-around">
                        <select className=" bg-slate-100 my-2 h-8 mx-2 md:m-0" value={network} onChange={event =>{switchNetwork(event.target.value);setNetwork(event.target.value)}} >
                            <option value="mumbai">Polygon Mumbai Testnet</option>
                            <option value="polygon">Polygon Mainnet</option>
                            <option value="ethereum">Ethereum Mainnet</option>
                            <option value="goerli">Ethereum Goerli Testnet</option>
                        </select>
                        <div className="my-2 mx-2 md:m-0">{balance} {network=='polygon'||network=='mumbai'?'MATIC':'ETH'}</div>
                        <div className="absolute m-1 md:m-0 right-0 top-0 md:relative"><button className="" onClick={(e)=>document.getElementById('user').style.visibility = 'visible'}> <img className="inline" src="/user.png" alt="" /> {user.name}</button></div>
                    </div>
                </>
                :
                <div>
                    <img src="" alt="" />
                    <button  onClick={(e)=>document.getElementById('wallet').style.visibility = 'visible'}>Connect</button>
                </div>
            }
        </header>
        <div className='overlay' id='user'>
            <div className='bg-white mx-4 p-2 rounded-2xl mt-8 flex items-center h-1/2 flex-col relative'>
                <button className="rounded-full text-white px-2 m-1 text-lg absolute right-0 bg-slate-400" onClick={(e)=>{document.getElementById('user').style.visibility = 'hidden'}}> X </button>
                <h1 className='mt-8 text-xl'>User Info</h1>
                <div className='border-t-8'></div>
                <p className='w-full text-sm'>Address : <span className="text-right">{user.address}</span></p>
                <button className="block absolute right-2 bottom-5 rounded-md py-2 px-4 m-2 bg-red-600 text-white" onClick={(e)=>logout(e)}>Logout</button>
            </div>
        </div>
        <div className='overlay' id='wallet'>
            <div className='bg-white mx-4 p-2 rounded-2xl mt-8 flex items-center h-1/2 flex-col relative'>
                <button className="rounded-full text-white px-2 m-1 text-lg absolute right-0 bg-slate-400" onClick={(e)=>{document.getElementById('wallet').style.visibility = 'hidden'}}> X </button>
                <button>
                    <img src={metamask} alt="" />
                    Metamask
                </button>
                <button onClick={(e)=>{document.getElementById('wallet').style.visibility = 'hidden';document.getElementById('ace').style.visibility = 'visible'}}>
                    <img src={ace} alt="" />
                    Ace
                </button>
            </div>
        </div>
        <div className='overlay' id='ace'>
            <div className='bg-white mx-4 p-2 rounded-2xl mt-8 flex items-center h-1/2 flex-col relative'>
                <button className="rounded-full text-white px-2 m-1 text-lg absolute right-0 bg-slate-400" onClick={(e)=>{document.getElementById('ace').style.visibility = 'hidden'}}> X </button>
                <Login/>
            </div>
        </div>
        </>
    )
}