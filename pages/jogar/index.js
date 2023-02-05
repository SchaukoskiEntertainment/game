import Head from "next/head"
import { useEffect, useState } from "react"
import Jogo from "../../components/jogo"

function Jogar() {
    return (
        <>
            <Head>
                <title>Jogar - CosimaBlox</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            </Head>
            <Jogo />
        </>
    ) 
}

export default Jogar