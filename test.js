const Transaction = require('temtumjs').Transaction;
const Wallet = require('temtumjs').Wallet;
const request = require('request-promise-native');
const fs = require('fs');

const wallet = new Wallet('http://192.168.204.133:3001/v1');
const tx = new Transaction('data');

const sender = '02941c359bd9dc27990ef8bceb1466b5b832bad4289dae9ed77facf5850559790e';
// privateKey: b01f79c616f252130fd877ab692be3ba9432b383eeb30c3c73546581e4ff4aa0

const recipient = '03c8348aad4f8f0241423cfab24bfb44346227c599901da6ee3b50b3abdab4bd15';
// privateKey: 0168474ea1a10e7366cbf6cc96095945d1d833a0c7ed25244f53c24937eda785

const privateKey = 'b01f79c616f252130fd877ab692be3ba9432b383eeb30c3c73546581e4ff4aa0';

const dataHash = '39156496b0b74926a6b344dc55aff34aba706c96404ae91fafc61314e15c1470';

const expirationTime = 100;

let i = 0;

wallet.getTokenForDataCreation(sender, privateKey, expirationTime)
  .then(res => {
    
    // const address = 'http://192.168.204.130:8080';

    dataTransactionsLoop(res.body.token);

  })

function dataTransactionsLoop (token) {
  setTimeout(() => {

    let data = fs.readFileSync(`./test${i}.pdf`);

    let txHex = tx.createWithData(sender, recipient, data, dataHash, privateKey, token);

    request({
      method: 'POST',
      uri: 'http://192.168.204.130:8080/transaction/send',
      headers : {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      json: {
        txHex
      },
    });

    console.log(`Transaction ${i} has been sent`);

    i = i + 1;
    if (i < 10) {
      transactionsLoop()
    }
  }, 1500)
}
