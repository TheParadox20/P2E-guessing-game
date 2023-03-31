# Wallet
python based EVM compatible backend wallet

## Inspiration
Last year (2022) after developing a blockchain-based betting platform I realized user onboarding was an issue since I had to educate new users in the crypto world on how to use wallets, that is, creating and managing keys.
So when I came across the hackathon I decided to create a solution that serves two major roles, provide all functionalities given by wallets such as metamask while protecting new users from the complexities of the crypto world

## What it does
This wallet allows users to:
<ol>
<li>Generate private key from basic user info</li>
<li>Send transaction</li>
<li>Interact with smart  contracts</li>
<li>Import wallets from private keys</li>
</ol>

## How I built it
The project consists of three major parts:
### 1. Frontend (React)
The user interface is a web application developed using the react framework and styled using tailwind CSS

It interacts with the backend application using HTTP requests

### 2. Backend (Flask)
The backend is developed with python flask and performs the following functions
<ul>
<li>Serves the frontend applications</li>
<li>connects to a MariaDB database hosted on amazon</li>
<li>Acts as an API serving the frontend application</li>
</ul>

In creating the wallet I used the web3py module

To encrypt and decrypt the user's private keys I used my own variant of AES

### 3. Contract (Solidity)Over the course of last year (2022)
The smart contract was developed in solidity on remix IDE and deployed to polygon Mumbai testnet.

The contract is a simple implementation of a guessing game in which the player deposits an undisclosed amount of funds. Player two then deposits some funds and if the amount player two deposited equals the amount deposited by player one then player two gets the sum of his and player one's deposit otherwise player one gets the sum

## Challenges I ran into
**Limited number of requests provided by infura**

To make the wallet appear in real-time, it has to periodically make fetch requests to a node. In this case, I used infura resources which cap the number of requests to 100,000 thousand a day.

## Accomplishments that I'm proud of
For one, it actually works. Users can now easily use the web app as their wallet without worrying about private keys or having to remember some random 12-word

## What I learned
While building this application I've come to understand more about keys in the Ethereum blockchain and the architecture of transactions

Another nugget I picked up is how transactions are sent and processed by nodes and how wallets interact with the nodes

It was my first time working with flask sessions, so while building the backend in flask I had to learn how to use flask sessions

## What's next
First I'll add the wallet as a feature to my betting application.

Add a feature through which users can easily convert between fiat and crypto, similar to an exchange

In time I'll package a wallet module that can be easily integrated into any project to support any contract

Finally, test if by running my own mining node I can validate and upload my own transactions to the blockchain while paying a very low transaction fee

## Demo link
[Video](https://www.loom.com/share/3d57476f77974dc5a39e50fe0ea0e206)

[Live app](https://wallet-theparadox20.vercel.app/)