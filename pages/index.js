import Head from "next/head"
import { useEffect, useState } from "react"
import Jogo from "../components/jogo"
import Link from "next/link"

function Home({player}) {
    return (
        <div className="container">
            <Head>
                <title>Construa sua casa, negocie e faça novas amizades! - CosimaBlox</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>
            <div className="borda-cima-container">
                <span className="borda-cima"></span>
            </div>
            <header>
                <div className="cabecalho">
                    <div className="row row-cabecalho">
                        <div className="col-xs-12 col-sm-6 col-lg-4">
                            <h1 className="logo">
                                <Link href="/">CosimaBlox</Link>
                            </h1>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-lg-8">
                            <span className="titulo-cabecalho">
                                Escolha sua sala, adicione bloxes e faça novos amigos!
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <div className="borda-cima-container">
                <span className="borda-cima"></span>
            </div>
            <menu>
                <div className="row">
                    <div className="col-sm-4 col-lg-2">
                        <Link href="/jogar"><li><i className="fa fa-play" aria-hidden="true"></i> Jogar</li></Link>
                    </div>
                    <div className="col-sm-4 col-lg-2">
                        <Link href="#blog"><li><i className="fa fa-book" aria-hidden="true"></i> Blog</li></Link>
                    </div>
                    <div className="col-sm-4 col-lg-2">
                        <Link href="#divulgar"><li><i className="fa fa-handshake-o" aria-hidden="true"></i> Divulgar</li></Link>
                    </div>
                </div>
            </menu>
            <div className="borda-cima-container">
                <span className="borda-cima"></span>
            </div>
            <main>
                <h2>Página Inicial</h2>
                <p>Olá, seja bem-vindo ao CosimaBlox.</p>
                <p>Estamos trabalhando para trazer a melhor experiência para todos usuários registrados ou não</p>
            </main>
            <div className="borda-cima-container">
                <span className="borda-cima"></span>
            </div>
            <footer>
                © 2023 CosimaBlox. Todos os direitos reservados
            </footer>
            <div className="borda-cima-container">
                <span className="borda-cima"></span>
            </div>
        </div>
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