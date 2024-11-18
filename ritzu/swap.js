import Web3 from "web3";
import axios from "axios";

const swapRitzu = async (priv) => {
    try {
    const web3 = new Web3('https://rpc.taiko.xyz')
    const account = web3.eth.accounts.privateKeyToAccount(priv)
    web3.eth.accounts.wallet.add(account)
    console.log(`Account ${account.address} To do Wrapped ETH`)
    const wrapedEth = async (getkey) => {
        const BaseContract = '0xa51894664a773981c6c112c43ce576f315d5b1b6'
        const getABi = await axios.get(`https://api.taikoscan.io/api?module=contract&action=getabi&address=${BaseContract}`)
        const abi = JSON.parse(getABi.data.result)
        const contract = new web3.eth.Contract(abi,  BaseContract)
        const amount = web3.utils.toWei('0.001', 'ether')
        const data = contract.methods.deposit().encodeABI()
        const gasEstimate = await web3.eth.estimateGas({
            from: account.address,
            to: BaseContract,
            data: data,
            value: amount
        });
        const tx = {
            from:  account.address,
            to: BaseContract,
            data: data,
            value: amount,
            gas: gasEstimate,
            gasPrice: 160000000
        }
        const receipt = await web3.eth.accounts.signTransaction(tx, getkey)
        const  txHash = await web3.eth.sendSignedTransaction(receipt.rawTransaction)
        return {
            txHash: txHash,
            amount: amount
        }
    }

    const getWraped = await wrapedEth(priv)
    if  (!getWraped.txHash) {
        return `wraped eth error, check your gass fee and  priv key`
    }

    const unwraped = async (getskey) => {
        const BaseContract = '0xa51894664a773981c6c112c43ce576f315d5b1b6'
        const getABi = await axios.get(`https://api.taikoscan.io/api?module=contract&action=getabi&address=${BaseContract}`)
        const abi = JSON.parse(getABi.data.result)
        const amount = 1000000000000000
        const contract = new web3.eth.Contract(abi, BaseContract)
        const data = contract.methods.withdraw(amount).encodeABI()
        const gasEstimate = await web3.eth.estimateGas({
            from: account.address,
            to: BaseContract,
            data: data,
        });
        const tx = {
            from:  account.address,
            to: BaseContract,
            data: data,
            gas: gasEstimate,
            gasPrice: 160000000
        }
        const receipt = await web3.eth.accounts.signTransaction(tx, getskey)
        const  txHash = await web3.eth.sendSignedTransaction(receipt.rawTransaction)
        return txHash
    }

    const getData = await unwraped(priv)
    return getData.logs[0].transactionHash
    } catch (error) {
        return `Error Rpc`
    }


}

export default swapRitzu
