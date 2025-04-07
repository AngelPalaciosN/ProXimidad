import React from 'react';
import Header from './modules/Header';
import Sec1 from './modules/Sec1';
import Sec2 from './modules/Sec2';
import Sec3 from './modules/Sec3';

function Home (){
    return (
    <>
       <Header/>
       <Sec1/>
       <div className="animated-line"></div>
       <Sec2/>
       <div className="animated-line"></div>
       <Sec3/>
    </>
    );

}


export default Home;
