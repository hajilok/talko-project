import Web3 from 'web3'
import axios from 'axios'

const voteRubyScore = async (privkey) => {
   try {
   const web3 = new Web3('https://rpc.taiko.xyz')
   const account = web3.eth.accounts.privateKeyToAccount(privkey)
   web3.eth.accounts.wallet.add(account)
   const voteContract = '0x4D1E2145082d0AB0fDa4a973dC4887C7295e21aB'

   const getAbi = await axios.get(`https://api.taikoscan.io/api?module=contract&action=getabi&address=${voteContract}`)
   const abi = JSON.parse(getAbi.data.result)
   const contract = new web3.eth.Contract(abi, voteContract)
   const data = contract.methods.vote().encodeABI()
   const gasEstimate = await web3.eth.estimateGas({
      from: account.address,
      to: voteContract,
      value: web3.utils.toWei('0', 'ether'),
      data: data
   })

   const tx = {
      from: account.address,
      to: voteContract,
      value: web3.utils.toWei('0', 'ether'),
      data: data,
      gas: gasEstimate,
      gasPrice: 200000000
   }

   const receipt = await web3.eth.accounts.signTransaction(tx, privkey)
   const bayar = await web3.eth.sendSignedTransaction(receipt.rawTransaction)
   return bayar.transactionHash
   } catch (error) {
      return `Error Rpc`
   }
}

export default voteRubyScore