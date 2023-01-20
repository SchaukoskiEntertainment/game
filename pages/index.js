import { useEffect, useState } from "react"
import Jogo from "../components/jogo";

function Home({player}) {
    return (
        <>
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