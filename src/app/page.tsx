'use client'
import axios from "axios";
import Image from "next/image";
import CryptoJS from 'crypto-js';
import { useState } from "react";

const SECRET_KEY = "kocakgeming"; 
type dataDec = {
  username:string;
  password:string;
}

export default function Home() {
  const [dataEnc, setDataEnc] = useState('');
  const [dataDec, setDataDec] = useState<dataDec>({
    username: "",
    password:""
  });

  const sendData = async() => {
    const encryptionData = {
      id:1,
      username:"Josh",
      password:"password"
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(encryptionData),
      SECRET_KEY
    ).toString();
    const hmac = CryptoJS.HmacSHA256(encryptedData, SECRET_KEY).toString();
    setDataEnc(encryptedData);
    try {
      const response = await axios.post('/api/decryptdata', { _payload: encryptedData, _verification:hmac });
      const {data} = response;
      setDataDec(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <button onClick={sendData}>kirim data</button>

     <h4>Data dikirim: {dataEnc}</h4>
     <hr />
     <h1>Data diDekripsi: {dataDec.username} & {dataDec.password}</h1>
    </div>
  );
}
