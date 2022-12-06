import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import { ethers } from "ethers";
import './App.css';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [connected, setConnected] = useState(false);
  const [idRead, setIdRead] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [nameCreate, setNameCreate] = useState("");
  const [nameEdit, setNameEdit] = useState("");

  //contract goerli testnet
  //const addressContract = ''
  //contract Ganache
  const addressContract = '0xF17147D357E01691f2B54b5E1a17096308872266';

  const abi = [
    {
      "inputs": [],
      "name": "nextId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "create",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "read",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newName",
          "type": "string"
        }
      ],
      "name": "update",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "destroy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  let contractDeployed = null;
  let contractDeployedSigner = null;

  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
    }
    if (contractDeployedSigner == null){
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
  }

  async function connectMetaMask (){
    if(typeof window.ethereum !== "undefined"){
        try
        {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            setConnected(true)
            toastMessage("You are connected");
        }
        catch (error) {
            console.log(error);
            setConnected(false);
            toastMessage("Oops.. An error, sorry..");
        }
    }
    else {
        setConnected(false)
        toastMessage("Conect your metamask.")
      }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function createUser(userName) {
    getProvider();
    const resp = await contractDeployedSigner.create(userName);
    console.log(resp);
    toastMessage('Created');
  }

  async function readUser(userId) {
    getProvider();
    try {
      const resp = await contractDeployed.read(userId);
      toastMessage(`Id ${userId} is the user ${resp[1]}`);      
    } catch (error) {
      toastMessage('User not found')
    }

  }

  async function updateUser(userId, userName) {
    getProvider();
    const resp = await contractDeployedSigner.update(userId, userName);
    toastMessage('Updated (wait a seconds to read again)');
  }

  async function deleteUser(userId) {
    getProvider();
    const resp = await contractDeployedSigner.destroy(userId);
    toastMessage('Deleted (wait a seconds to read again)');
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Advanced storage smart contract" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
        {!connected &&
          <button onClick={connectMetaMask}>Connect your wallet</button>
        }
        <hr/>
        <h1>CRUD</h1>
        <h3>Create User</h3>
        <span>Name</span>
        <input type="text" onChange={(e) => setNameCreate(e.target.value)} value={nameCreate}/>
        <button onClick={() => createUser(nameCreate)}>Create</button>
        <hr/>
        <h3>Read User</h3>
        <span>Id</span>
        <input type="text" onChange={(e) => setIdRead(e.target.value)} value={idRead}/>
        <button onClick={() => readUser(idRead)}>Read</button>
        <hr/>
        <h3>Update User</h3>
        <span>Id</span>
        <input type="text" onChange={(e) => setIdEdit(e.target.value)} value={idEdit}/>
        <span>New name</span>
        <input type="text" onChange={(e) => setNameEdit(e.target.value)} value={nameEdit}/>
        <button onClick={() => updateUser(idEdit, nameEdit)}>Edit</button>
        <hr/>
        <h3>Delete User</h3>
        <span>Id</span>
        <input type="text" onChange={(e) => setIdDelete(e.target.value)} value={idDelete}/>
        <button onClick={() => deleteUser(idDelete)}>Delete</button>
        

      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;
