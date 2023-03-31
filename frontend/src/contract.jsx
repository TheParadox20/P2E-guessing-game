import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import {baseURL} from './data.json'

export default function Contract(){
    let [create, setCreate] = useState(true);
    let [betID, setBetID] = useState('');
    let [amount, setAmount] = useState(0);
    let [guess,setGuess] = useState(0);
    let [balance, setBalance] = useState(0);

    let stake = (e,type)=>{
        e.preventDefault();
        fetch(baseURL+'contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                betID: betID,
                amount: amount,
                guess: guess
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.status=='success'){
                alert(`Transaction successful\n ${data.hash}`)
            }
        }
        )
    }

    let getBalance = ()=>{
        fetch(baseURL+'contract/balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.status=='success'){
                console.log(data)
                setBalance(data.balance)
            }
        }
        )
    }
    //get balance every 5 seconds
    setInterval(()=>{
        getBalance();
    }, 60000*0.1)
    return(
        <div>
            <Header type='contract'/>
            <h3 className="text-center my-8 text-2xl font-semibold">Guessing Game</h3>
            <h3 className="text-center my-8 text-lg font-semibold">Contract balance {balance} ETH</h3>
            <div className="flex justify-around my-4">
                <button id={create?'active':''} className="block py-4 px-4 rounded-xl" onClick={e=>setCreate(true)}>Create Game</button>
                <button id={create?'':'active'} className="block py-4 px-4 rounded-xl" onClick={e=>setCreate(false)}>Play Game</button>
            </div>
            {
                create?
                <div className="flex flex-col w-10/12 md:w-1/3 mx-auto justify-center">
                    <input className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Bet ID" value={betID} onChange={event=>{setBetID(event.target.value)}} />
                    <input className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Guess(1-10)" value={guess} onChange={event=>{setGuess(event.target.value)}} />
                    <input className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Enter the amount to bet" value={amount} onChange={event=>{setAmount(event.target.value)}} />
                    <button className=" bg-blue-500 text-white w-3/4 mx-auto py-4 px-4 mt-8 rounded-xl" onClick={(e)=>stake(e,'create')}>Create</button>
                </div>
                :
                <div className="flex flex-col w-10/12 md:w-1/3 mx-auto justify-center">
                    <input  className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Enter bet ID" value={betID} onChange={event=>{setBetID(event.target.value)}} />
                    <input className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Guess(1-10)" value={guess} onChange={event=>{setGuess(event.target.value)}} />
                    <input  className="block my-4 h-12 rounded-sm pl-4" type="number" placeholder="Guess Amount" value={amount} onChange={event=>{setAmount(event.target.value)}} />
                    <button className=" bg-blue-500 text-white w-3/4 mx-auto py-4 px-4 mt-8 rounded-xl"  onClick={(e)=>stake(e,'stake')}>Stake</button>
                </div>
            }
            <Footer/>
        </div>
    )
}