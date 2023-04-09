import os
from flask import Flask, send_from_directory, request, session
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import hashlib
from AESCipher.engine import cryptoEngine
import wallet

#CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(64) NOT NULL, private_key BINARY(64) NOT NULL, address VARCHAR(42) NOT NULL);
#CREATE TABLE bets (id VARCHAR(255) PRIMARY KEY, staker VARCHAR(42), mode VARCHAR(20) NOT NULL, amount BIGINT NOT NULL, guess INT NOT NULL);

# con = mysql.connector.connect(
#   host="eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
#   user="g69oj8qro3rtnqj1",
#   password="aeosrm4kqv9akf96",
#   database="m7ukhlpb3u1u4yjb"
# )

con = mysql.connector.connect(
  host="localhost",
  user="sammy",
  password="sammy",
  database="wallet"
)

cur = con.cursor()
cur.execute("SELECT * FROM bets")
games = cur.fetchall()

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

#interact with contract
@app.route("/contract", methods=['POST'])
def contract():
    data = request.get_json()
    if 'pk' in session:
        if data['type']=='create':
            data = request.get_json()
            cur.execute("INSERT INTO bets (id, staker, mode, amount, guess) VALUES (%s, %s, %s, %s, %s)", (data['betID'], session['address'], data['mode'], data['amount'], data['guess']))
            con.commit()
            #update games
            cur.execute("SELECT * FROM bets")
            global games
            games = cur.fetchall()
            return {"status":"success","hash":wallet.placeBet(session['pk'], session['address'], data['amount'], data['betID'])}
        if data['type']=='stake':
            hash = wallet.placeGuess(session['pk'], session['address'], data['amount'], data['betID'])
            #check mode
            cur.execute("SELECT * FROM bets WHERE id=%s", (data['betID'],))
            bet = cur.fetchone()
            print(bet)
            #find winner
            if(bet[4]==data['guess']):#if guess is correct
                wallet.closeBet(bet[0], True, bet[2])
            else:
                wallet.closeBet(bet[0], False, bet[2])
            #if mode==single remove from table
            if(bet[3]=='s'):
                cur.execute("DELETE FROM bets WHERE id=%s", (data['betID'],))
                con.commit()
            return {"status":"success","hash":hash}
    return {"status":"failure"}

#get games from table
@app.route("/games")
def bets():
    #crrate list of bets
    bets = []
    for bet in games:
        bets.append({"id":bet[0], "stake":0.002, "staker":bet[1], "mode":bet[2]})
    return {"status":"success", "games":bets}

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