//SPDX-License-Identifier: MIT License
pragma solidity >0.8.1;

contract Guess{
    /*
     * The contract account holds all the stakes in one address
     * User 1 creates bet with desired amount
     * User 2 guesses the amount staked if true get's the money if false user 1 get's user's 2 money
    */
    address payable public owner;
    constructor() payable{
        owner=payable(msg.sender);
    }
    receive() payable external {}
    fallback() payable external {}
    struct Bet{
        uint amount;//amount staked by creatoe
        uint staked;//amount placed by staker
        address payable creator;
        address payable staker;
    }
    mapping (string=>Bet) bets;
    function placeBet(string calldata betID) public payable{
        /*
         * betID used to identify a bet
        */
        Bet memory bet;
        bet.amount+=msg.value;
        bet.creator=payable(msg.sender);
        bets[betID]=bet;
    }
    function placeGuess(string calldata betID) public payable{
        Bet memory bet = bets[betID];
        bet.amount=bet.amount+msg.value;
        bet.staked=msg.value;
        bet.staker=payable(msg.sender);
        bets[betID]=bet;
    }
    function getBet(string calldata betID) public view returns(Bet memory bet){
        bet = bets[betID];
    }
    function closeBet(string calldata betID,bool winner,bool delet) public payable{
        require(msg.sender==owner,"Only owner can close bet");
        Bet memory bet = bets[betID];
        if (winner) bet.staker.call{value : (bet.amount)}("");
        else bet.creator.call{value : (delet?bet.amount:bet.staked)}("");
        if (delet) delete bets[betID];
        else{
            bet.amount=bet.amount-bet.staked;
            bet.staked=0;
            bet.staker=payable(address(0));
            bets[betID]=bet;
        }
    }
}