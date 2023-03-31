from web3 import Web3
from web3 import Account
import hashlib
import json

# Open the JSON file and load contract ABI
with open('data.json', 'r') as f:
    data = json.load(f)
contract_address = data['CONTRACT_ADDRESS']  # the address of the contract on the network
contract_abi = data['abi']  # the ABI is a list of dictionaries describing the contract's interface

netowrks = [
    {
        "name": "polygon",
        "api":"https://polygon-mainnet.infura.io/v3/b915c6cb5ec147919d05ca756a490a6f"
    },
    {
        "name": "mumbai",
        "api":"https://polygon-mumbai.infura.io/v3/b915c6cb5ec147919d05ca756a490a6f"
    },
    {
        "name": "ethereum",
        "api":"https://mainnet.infura.io/v3/b915c6cb5ec147919d05ca756a490a6f"
    },
    {
        "name": "goerli",
        "api":"https://goerli.infura.io/v3/b915c6cb5ec147919d05ca756a490a6f"
    }
]
network=netowrks[1]
web3 = Web3(Web3.HTTPProvider(network['api']))

# create a Contract instance from the address and ABI
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

#switch network function
def switchNetwork(net:int):
    global network
    global web3
    network=netowrks[net]
    web3 = Web3(Web3.HTTPProvider(network['api']))

#create private key from username,email,DOB, and password
def createPK(username, email, DOB, password):
    key =  hashlib.sha256((username+email+DOB+password).encode()).hexdigest()
    return key

#currency conversion
def convertCurrency(amount, from_currency, to_currency):
    pass

#eth to wei
def ethToWei(amount):
    return web3.toWei(amount, 'ether')
#wei to eth
def weiToEth(amount):
    return web3.fromWei(amount, 'ether')
def getAddress(pk):
    return Account.from_key(pk).address
def getBalance(address):
    return weiToEth(web3.eth.get_balance(address))
def sendTransaction(pk, to, amount):
    account = Account.from_key(pk)
    # Build the transaction
    transaction = {
        'to': to,
        'value': web3.toWei(float(amount), 'ether'),
        'gas': 21000,
        'gasPrice': web3.toWei('5000', 'gwei'),
        'nonce': web3.eth.getTransactionCount(account.address),
        'chainId': 80001
    }
    # Sign the transaction with your private key
    signed_txn = account.sign_transaction(transaction)
    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    # Wait for the transaction to be mined
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt.transactionHash.hex()

def getBet(id):
    return (contract.functions.getBetInfo(id).call())

def getContractBalance():
    return weiToEth(contract.functions.getContractBalance().call())


def placeBet(pk,sender_account,amount,id):
    nonce = web3.eth.getTransactionCount(sender_account)
    transaction = contract.functions.placeBet(id).buildTransaction({
        'from': sender_account,
        'value': web3.toWei(float(amount), 'ether'),
        'gas': 200000,
        'gasPrice': web3.toWei('100', 'gwei'),
        'nonce': nonce,
    })
    signed_txn = web3.eth.account.signTransaction(transaction, pk)
    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt.transactionHash.hex()

def closeBet(pk,sender_account,amount,id):
    nonce = web3.eth.getTransactionCount(sender_account)
    print(id,amount)
    transaction = contract.functions.closeBet(id).buildTransaction({
        'from': sender_account,
        'value': web3.toWei(float(amount), 'ether'),
        'gas': 200000,
        'gasPrice': web3.toWei('100', 'gwei'),
        'nonce': nonce,
    })
    signed_txn = web3.eth.account.signTransaction(transaction, pk)
    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt.transactionHash.hex()