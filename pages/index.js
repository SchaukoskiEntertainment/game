import Head from "next/head";
import { useEffect, useState } from "react"
import Jogo from "../components/jogo";

function Home({player}) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            </Head>
            <Jogo />
        </>
    ) 
}

export default Home
/*
export async function getServerSideProps() {
    /*var xPlayer = Math.floor(Math.random() * 621);
    var yPlayer = Math.floor(Math.random() * 341);
    var idPlayer = Math.floor(Math.random() * 1000)
    return {
      props: {
        player: {
            x: xPlayer,
            y: yPlayer,
            id: idPlayer
        }
      },
    }
}*/