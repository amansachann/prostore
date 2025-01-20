import React from "react";
import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
  return (
    <div className="h-screen w-screen flex-center">
      <Image src={loader} width={150} height={150} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;
