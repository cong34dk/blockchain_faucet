import { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  // State để lưu trữ nhà cung cấp Ethereum và thể hiện Web3
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });

  // State để lưu trữ địa chỉ tài khoản Ethereum hiện tại
  const [account, setAccount] = useState(null);

  // useEffect để khởi tạo nhà cung cấp Ethereum khi component được gắn kết
  useEffect(() => {
    const loadProvider = async () => {
      // Kiểm tra xem MetaMask có được cài đặt không
      const provider = await detectEthereumProvider();

      if (provider) {
        // Yêu cầu quyền truy cập tài khoản từ người dùng nếu MetaMask được cài đặt
        provider.request({ method: "eth_requestAccounts" });
        
        // Khởi tạo Web3 instance và cập nhật state
        setWeb3Api({
          web3: new Web3(provider),
          provider
        });
      } else {
        console.error("Vui lòng cài đặt MetaMask");
      }
    }
    loadProvider();
  }, []); // Dependency array rỗng để chỉ chạy một lần khi component được gắn kết

  // useEffect để lấy địa chỉ tài khoản Ethereum khi Web3 instance được khởi tạo
  useEffect(() => {
    const getAccount = async () => {
      // Lấy danh sách các tài khoản từ Web3 và cập nhật state
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    // Kiểm tra xem Web3 instance đã được khởi tạo chưa
    web3Api.web3 && getAccount();
  }, [web3Api.web3]); // Dependency là web3Api.web3 để chạy khi Web3 instance thay đổi

  // Phần render của component
  return (
    <div className="faucet-wrapper">
      <div className='faucet'>
        <div className='balance-view is-size-2'>
          Current Balance: <strong>10 ETH</strong>
        </div>
        <button className='button is-primary is-large is-focused mr-5'>Donate</button>
        <button className='button is-primary is-large is-focused is-danger'>Withdraw</button>
        <span>
          <p>
            <strong>Accounts Address: </strong>
            {
              // Hiển thị địa chỉ tài khoản hoặc thông báo nếu quyền truy cập bị từ chối
              account ? account : "Accounts Denied"
            }
          </p>
        </span>
      </div>
    </div>
  );
}

export default App;
