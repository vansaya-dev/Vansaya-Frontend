
"use client"
import Image from "next/image";
import axiosHttp from "./api/_api-interceptor";

export default function Home() {

  const handleClick = async () => {
    let response = await axiosHttp.get('/hello');
    console.log(response, 'nigga response')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello Faizan boss is the hero on develop branch.
      <button
        onClick={handleClick}
      >Click me please yrr😞</button>
    </main>
  );
}
