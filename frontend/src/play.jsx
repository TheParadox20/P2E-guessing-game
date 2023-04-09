import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import {baseURL} from './data.json'
import Header from "./header";

export default function Play(){
    let [betID, setBetID] = useState('');
    let [amount, setAmount] = useState(0);
    let [guess,setGuess] = useState();

    let navigate = useNavigate();
    let {id} = useParams();

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

    return(
        <div>
            <Header/>
            <button onClick={(e)=>{navigate('/')}} className='text-5xl'>{'<'}</button>
            <div className="flex flex-col w-10/12 md:w-1/3 mx-auto justify-center">
                <p>{id}</p>
                <input className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Guess(1-10)" value={guess} onChange={event=>{setGuess(event.target.value)}} />
                <input  className="block my-4 h-12 rounded-sm pl-4" type="number" placeholder="Guess Amount" value={amount} onChange={event=>{setAmount(event.target.value)}} />
                <button className=" bg-blue-500 text-white w-3/4 mx-auto py-4 px-4 mt-8 rounded-xl"  onClick={(e)=>stake(e,'stake')}>Stake</button>
            </div>
        </div>
    )
}