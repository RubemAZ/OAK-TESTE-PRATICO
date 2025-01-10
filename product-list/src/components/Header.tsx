import React from 'react'
import Image from 'next/image';


export const Header = () => {
  return (
    <div className="fixed max-w-full top-0 left-0 w-full z-50 bg-white shadow-lg">
      <nav className="mx-12 p-4 flex justify-between items-center">
          <a href="https://www.oaktecnologia.com/">
            <Image src="/img/oak-logo.png" alt="Logo" width={180} height={60} />
          </a>

          <h1 className="text-dark-green text-3xl ">
              Qualificação de candidato Estágio de desenvolvimento
          </h1>
      </nav>
    </div>
  );
};
