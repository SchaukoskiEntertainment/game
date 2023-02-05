import { useEffect, useState } from 'react';
import styles from "../jogo/Jogo.module.css"

export default function Cadastrar() {
    
    const cadastrar = () => {
        console.log("Cadastrar")
        fetch("/api/usuarios/add", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            //body: JSON.stringify({ email: "test@test.com", nomeAvatar: "ed", senha: "senha123" })
            body: JSON.stringify({ email: "", nomeAvatar: "", senha: "" })
        }).then((response) => {
            console.log(response)
        })
    }

    return (
        <main className={styles.mainLogin}>
            <h2>Cadastrar</h2>
            <label htmlFor="email">Email</label>
            <input className={styles.input} type="text" id="email" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }} />
            <label htmlFor="nomeAvatar">Nome do avatar</label>
            <input className={styles.input} type="text" id="nomeAvatar" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }} />
            <label htmlFor="senha">Senha</label>
            <input className={styles.input} type="password" id="senha" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }} />
            <label htmlFor="repitaSenha">Repita a Senha</label>
            <input className={styles.input} type="password" id="repitaSenha" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }} />
            <span style={{textAlign: "right", textDecoration: "underline", cursor: "pointer"}} onClick={(e) => setJanela(prev => { return {...prev, login: true } })} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }}>Fazer login</span>
            <button onClick={cadastrar} className={"btn btn-secondary " + styles.entrarBtn} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }}>Cadastrar</button>
        </main>
    )
}