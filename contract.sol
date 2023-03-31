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
        uint amount;
        uint8 guess;
        address payable creator;
    }
    mapping (string=>Bet) bets;
    function placeBet(string memory betID, uint8 guess) public payable{
        /*
         * betID used to identify a bet
         * amount to stake
        */
        Bet memory bet;
        bet.amount+=msg.value;
        bet.guess = guess;
        bet.creator=payable(msg.sender);
        bets[betID]=bet;
        
    }
    function closeBet(string memory betID, uint8 guess) public payable{
        Bet memory bet = bets[betID];
        require(msg.value==bet.amount,"Must deposit an equal amount");
        if(guess==bet.guess) payable(msg.sender).call{value : (msg.value+bet.amount)}(""); //if guess is correct send to person who guessed
        else bet.creator.call{value : (msg.value+bet.amount)}(""); //else send to creator
        delete bets[betID];
    }
    function getBetAmount(string memory betID) public view returns(uint amount){
        Bet memory bet = bets[betID];
        amount = bet.amount;
    }
}
