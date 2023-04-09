import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import {baseURL} from './data.json'
import { Link } from "react-router-dom";
import Play from "./play";

export default function Game(){
    let [create, setCreate] = useState(false);
    let [betID, setBetID] = useState();
    let [amount, setAmount] = useState();
    let [guess,setGuess] = useState();
    let [mode, setMode] = useState('single');
    let [games, setGames] = useState([]);

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
                guess: guess,
                mode: mode
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

    fetch(baseURL+'games')
    .then(res=>res.json())
    .then(data=>{
        if(data.status=='success'){
            setGames(data.games)
        }
    })  
    return(
        <div>
            <Header/>
            <h3 className="text-center my-8 text-2xl font-semibold">Guessing Game</h3>
            <div className="flex justify-around my-4">
                <button id={create?'':'active'} className="block py-4 px-4 rounded-xl" onClick={e=>setCreate(false)}>Play Game</button>
                <button id={create?'active':''} className="block py-4 px-4 rounded-xl" onClick={e=>setCreate(true)}>Create Game</button>
            </div>
            {
                create?
                <div className="flex flex-col w-10/12 md:w-1/3 mx-auto justify-center">
                    <input className="block my-4 h-12 rounded-sm pl-4" type="text" placeholder="Bet ID" value={betID} onChange={event=>{setBetID(event.target.value)}} />
                    <select className="block w-full my-4 h-8 rounded-lg pl-4" value={mode} onChange={event =>{setMode(event.target.value);setPK('')}} >
                        <option value="single">Single</option>
                        <option value="multiple">Multiple</option>
                    </select>
                    <input className="block my-4 h-12 rounded-sm pl-4" type="number" placeholder="Guess(1-10)" value={guess} onChange={event=>{setGuess(event.target.value)}} />
                    <input className="block my-4 h-12 rounded-sm pl-4" type="number" placeholder="Enter the amount to stake" value={amount} onChange={event=>{setAmount(event.target.value)}} />
                    <button className=" bg-blue-500 text-white w-3/4 mx-auto py-4 px-4 mt-8 rounded-xl" onClick={(e)=>stake(e,'create')}>Create</button>
                </div>
                :
                <div>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th>Game ID</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="py-8 border-b-2">
                                <td>alpha</td>
                                <td>0.001</td>
                                <td>Single</td>
                                <td className=" bg-blue-500 text-white text-center w-20 mx-auto rounded-2xl"><Link to={'play/'+'alpha'}>Guess</Link></td>
                            </tr>
                            {
                                games.map((game,i)=>{
                                    return(
                                        <tr className="py-8 border-b-2">
                                            <td>{game.id}</td>
                                            <td>{game.stake}</td>
                                            <td>{game.mode}</td>
                                            <td className=" bg-blue-500 text-white text-center w-20 mx-auto rounded-2xl"><Link to={'play/'+game.id}>Guess</Link></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
            <Footer/>
        </div>
    )
}