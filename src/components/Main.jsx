import React, { useState, useEffect } from 'react';
const ethers = require("ethers")

const address = "0xbdC400EE07078b57Ee1F3447dD6981B59Cf041D6"
const abi = [
	{
		"inputs": [],
		"name": "NotOwner",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "funder",
				"type": "address"
			}
		],
		"name": "getBalanceOfFunder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINIMUM_USD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const Main = () => {
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState("0.001");
    const [withdrawalAmount, setWithdrawalAmount] = useState("0.001");

    useEffect(() => {
        if(!window.ethereum) {
            alert("please install MetaMask")
            return
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        
        provider.send("eth_requestAccounts", [])
        .catch((e)=>console.log(e))

        const contract = new ethers.Contract(address, abi, provider.getSigner());
    
        setContract(contract)
    }, [])

    useEffect(() => {
        async function loadBalance() {
            if (!contract) return;

            const balance = await contract.getBalance();

            setBalance(ethers.utils.formatEther(balance));
        }

        loadBalance();
    }, [contract]);

    const handleDeposit = async () => {
        if (!contract) return;
        if(!depositAmount) return;

        let err = 0;
        const tx = await contract.deposit({ value: ethers.utils.parseEther(depositAmount) })
                                .catch((e)=>{
                                    alert(e);
                                    err = 1;
                                });
        if(err)
            return;

        alert("Waiting for confirmation");
        
        await tx.wait()
        
        alert("Deposit successful!");
        const balance = await contract.getBalance();
        setBalance(ethers.utils.formatEther(balance));
    };
    
    const handleWithdrawal = async () => {
        if (!contract) return;
        if(!withdrawalAmount) return;
        
        let err = 0;
        const tx =  await contract.withdraw(ethers.utils.parseEther(withdrawalAmount))
                                    .catch((e)=>{
                                        alert(e);
                                        err = 1;
                                    });
        if(err)
            return;
        
        alert("Waiting for confirmation");
        await tx.wait()
        
        alert("Withdrawal successful!");
        const balance = await contract.getBalance();
        setBalance(ethers.utils.formatEther(balance));
    };
    
    return (
        <div className="bg-gray-200 h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-medium">Funds Management</h1>
                <p className='text-xs'>Smart Contract on GOERLI Testnet.</p>
                <a className='text-xs text-indigo-500' href="https://goerli.etherscan.io/address/0xbdC400EE07078b57Ee1F3447dD6981B59Cf041D6">0xbdC400EE07078b57Ee1F3447dD6981B59Cf041D6</a>
                <p className="mt-4">Your balance inside the contract: {balance} ETH</p>
                <div className="mt-6">
                    <input
                        className="w-full p-2 border border-gray-400 rounded-lg"
                        type="text"
                        placeholder="Deposit amount"
                        value={depositAmount}
                        onChange={event => setDepositAmount(event.target.value)}
                    />
                </div>
                <p className='my-1 text-xs'>Deposit at least 5$</p>
                <div className="">
                    <button
                        className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                        onClick={handleDeposit}
                    >
                        Deposit
                    </button>
                </div>
                <div className="mt-6">
                    <input
                        className="w-full p-2 border border-gray-400 rounded-lg"
                        type="text"
                        placeholder="Withdrawal amount"
                        value={withdrawalAmount}
                        onChange={event => setWithdrawalAmount(event.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <button
                        className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                        onClick={handleWithdrawal}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Main;
