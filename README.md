# Wallet
python based EVM compatible backend wallet

## Inspiration


## What it does

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

## Accomplishments that I'm proud of

## What I learned
While building this application I've come to understand more about keys in the Ethereum blockchain and the architecture of transactions

Another nugget I picked up is how transactions are sent and processed by nodes and how wallets interact with the nodes

It was my first time working with flask sessions, so while building the backend in flask I had to learn how to use flask sessions

## What's next


## Demo link
[Video]()

[Live app]()