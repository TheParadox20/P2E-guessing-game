import os
from flask import Flask, send_from_directory, request, session
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import hashlib
from AESCipher.engine import cryptoEngine
import wallet

#CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(64) NOT NULL, private_key BINARY(64) NOT NULL, address VARCHAR(42) NOT NULL);

con = mysql.connector.connect(
  host="eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user="g69oj8qro3rtnqj1",
  password="aeosrm4kqv9akf96",
  database="m7ukhlpb3u1u4yjb"
)

# con = mysql.connector.connect(
#   host="localhost",
#   user="sammy",
#   password="sammy",
#   database="wallet"
# )

cur = con.cursor()


app = Flask(__name__, static_folder='frontend/dist')
app.secret_key = "secret"
CORS(app)
# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route("/test")
def test():
    return {"test":"Hello World"}

@app.route("/signup", methods=['POST'])
def register():
    data = request.get_json()
    password = data['password']
    key=password
    if len(password) != 16:
        for i in range(16-len(password)):
            key += "0"
    engine = cryptoEngine((1,key))
    if 0<len(data['pk'])!=64:
        return {"status":"error", "message":"Invalid private key"}
    pk=data['pk']
    if data['pk'] == "":
        pk = wallet.createPK(data['username'], data['email'], data['DOB'], data['password'])
    cur.execute("INSERT INTO users (username, email, password, private_key, address) VALUES (%s, %s, %s, %s, %s)", (data['username'], data['email'], hashlib.sha256(password.encode()).hexdigest(), engine.encrypt(pk), wallet.getAddress(pk)))
    con.commit()
    return {"status":"success"}

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    password = data['password']
    key=password
    if len(password) != 16:
        for i in range(16-len(password)):
            key += "0"
    engine = cryptoEngine((1,key))
    cur.execute("SELECT * FROM users WHERE username=%s AND password=%s", (data['username'], hashlib.sha256(password.encode()).hexdigest()))
    user = cur.fetchone()
    if user:
        session['pk'] = engine.decrypt(user[4]).decode('utf-8')
        session['address'] = user[5]
        return {"status":"success", "user": {"id":user[0], "username":user[1], "email":user[2], "address":user[5], "balance":wallet.getBalance(user[5])}}
    return {"status":"failure"}

#get balance
@app.route("/balance")
def balance():
    if 'pk' in session:
        return {"status":"success", "balance":wallet.getBalance(session['address'])}
    return {"status":"failure"}

#send money
@app.route("/transact", methods=['POST'])
def send():
    data = request.get_json()
    if 'pk' in session:
        return {"status":"success","hash":wallet.sendTransaction(session['pk'], data['to'], data['amount'])}
    return {"status":"failure"}

#interact with contract
@app.route("/contract", methods=['POST'])
def contract():
    data = request.get_json()
    if 'pk' in session:
        if data['type']=='create':
            return {"status":"success","hash":wallet.placeBet(session['pk'], session['address'], data['amount'], data['betID'])}
        if data['type']=='stake':
            return {"status":"success","hash":wallet.closeBet(session['pk'], session['address'], data['amount'], data['betID'])}
    return {"status":"failure"}

#get contract balance
@app.route("/contract/balance", methods=['POST'])
def contractBalance():
    return {"status":"success", "balance":wallet.getContractBalance()}

#switch network
@app.route("/network", methods=['POST'])
def network():
    data = request.get_json()
    if data['network']=='polygon':
        wallet.switchNetwork(0)
    elif data['network']=='mumbai':
        wallet.switchNetwork(1)
    elif data['network']=='ethereum':
        wallet.switchNetwork(2)
    elif data['network']=='goerli':
        wallet.switchNetwork(3)
    return {"status":"success","balance":wallet.getBalance(session['address'])}

#logout
@app.route("/logout", methods=['POST'])
def logout():
    session.pop('pk', None)
    session.pop('address', None)
    return {"status":"success"}

if __name__ == '__main__':
    app.debug = True
    app.run()