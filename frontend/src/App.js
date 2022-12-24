import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

import {  useState, useEffect } from 'react';
import { ethers } from "ethers";
import {ToastContainer, toast} from "react-toastify";

import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter, { async } from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import Button from "react-bootstrap/Button";

import { format6FirstsAnd6LastsChar } from "./utils";
import meta from "./assets/metamask.png";

function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const [idRead, setIdRead] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const [nameCreate, setNameCreate] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [allUsers, setAllUsers] = useState(null);
  
  const contractAddress = '0x74E5c6Eb87F00662Fa83DF64a1Ed737B01a6C878';

  const abi = [
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
      "name": "destroy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAll",
      "outputs": [
        {
          "components": [
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
          "internalType": "struct Crud.User[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
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
      "type": "function"
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
      "type": "function"
    }
  ];

  async function handleConnectWallet (){
    try {
      setLoading(true)
      let prov =  new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);

      let userAcc = await prov.send('eth_requestAccounts', []);
      setUser({account: userAcc[0], connected: true});

      const contrSig = new ethers.Contract(contractAddress, abi, prov.getSigner())
      setSigner( contrSig)

    } catch (error) {
      toastMessage(error.reason)
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    
    async function getData() {
      try {
        const {ethereum} = window;
        if (!ethereum){
          toastMessage('Metamask not detected');
        }
  
        const goerliChainId = "0x5";
        const currentChainId = await window.ethereum.request({method: 'eth_chainId'})
        if (goerliChainId != currentChainId){
          toastMessage('Change to goerli testnet')
        }    
      } catch (error) {
        toastMessage(error.reason)        
      }
      
    }

    getData()  
    
  }, [])
  
  async function isConnected(){
    if (!user.connected){
      toastMessage('You are not connected!')
      return false;
    }
    return true;
  }

  async function handleDisconnect(){
    try {
      setUser({});
      setSigner(null);
      setProvider(null);
    } catch (error) {
      toastMessage(error.reason)
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function createUser(userName) {
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.create(userName);
      await resp.wait();
      toastMessage('Created');  
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  async function readUser(userId) {
    
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.read(userId);
      toastMessage(`Id ${userId} is the user ${resp[1]}`);      
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  async function getAllUsers() {
    
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.getAll();
      let arrayUsers =[];
      for (let i = 0 ; i < resp.length  ; i++){
        if (resp[i].id.toString() != "0"){
          let newUser = {id: resp[i].id.toString(), name: resp[i].name};
          arrayUsers.push(newUser)
        }
      }
      setAllUsers(arrayUsers);
      toastMessage('Users loaded')  
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  async function updateUser(userId, userName) {
    
    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.update(userId, userName);
      await resp.wait();
      toastMessage('Updated. Thanks for waiting.')  
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
    
  }

  async function deleteUser(userId) {

    try {
      if (!isConnected()) {
        return;
      }
      setLoading(true);
      const resp = await signer.destroy(userId);
      await resp.wait();
      toastMessage('Deleted.')  
    } catch (error) {
      toastMessage(error.reason)      
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Blockchain CRUD" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
 
        <hr/>
        <h1>CRUD</h1>

        {loading && 
          <h1>Loading....</h1>
        }
        { !user.connected ?<>
            <Button className="commands" variant="btn btn-primary" onClick={handleConnectWallet}>
              <img src={meta} alt="metamask" width="30px" height="30px"/>Connect to Metamask
            </Button></>
          : <>
            <label>Welcome {format6FirstsAnd6LastsChar(user.account)}</label>
            <button className="btn btn-primary commands" onClick={handleDisconnect}>Disconnect</button>
          </>
        }
        <hr/>

        <h3>Create User</h3>
        <input type="text" className="commands" placeholder="Type user name" onChange={(e) => setNameCreate(e.target.value)} value={nameCreate}/>
        <button className="btn btn-primary commands" onClick={() => createUser(nameCreate)}>Create</button>
        <hr/>
        <h3>Read User</h3>
        <input type="number" className="commands" placeholder="Type user id" onChange={(e) => setIdRead(e.target.value)} value={idRead}/>
        <button className="btn btn-primary commands" onClick={() => readUser(idRead)}>Read</button>
        <hr/>
        <h3>Update User</h3>
        <input className="commands" type="number" placeholder="Type user id" onChange={(e) => setIdEdit(e.target.value)} value={idEdit}/>
        <input className="commands" placeholder="Type new user name" onChange={(e) => setNameEdit(e.target.value)} value={nameEdit}/>
        <button className="btn btn-primary commands" onClick={() => updateUser(idEdit, nameEdit)}>Edit</button>
        <hr/>
        <h3>Delete User</h3>
        <input className="commands" type="number" placeholder="Type user id to delete" onChange={(e) => setIdDelete(e.target.value)} value={idDelete}/>
        <button className="btn btn-primary commands" onClick={() => deleteUser(idDelete)}>Delete</button>
        <hr/>
        <h3>Load Users</h3>
        <button className="btn btn-primary commands" onClick={() => getAllUsers()}>Load all</button>
        <table className="table">
          <thead>
            <tr>
              <td>Id</td>
              <td>name</td>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, i) => 
              <tr>
                <td>{user.id}</td>
                <td>{user.name}</td>
              </tr>
            )}
          </tbody>
        </table>
      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />
    </div>
  );
}

export default App;
