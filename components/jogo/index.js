import Room from "../room";
import { useEffect, useState } from "react"
import styles from "./Jogo.module.css"
import Cadastrar from "../cadastrar";

export default function Jogo() {

    const [movimentaJanela, setMovimentaJanela] = useState(false)
    const [primeiraOcorrencia, setPrimeiraOcorrencia] = useState(true)
    const [janela, setJanela] = useState({x: 0, y:0, larguraMaxima: 500, visible: false, login: true})
    const [tela, setTela] = useState("jogo")
    const [moved, setMoved] = useState(false)
    const [mouseXInitial, setMouseXInitial] = useState(0)
    const [mouseYInitial, setMouseYInitial] = useState(0)
    const [roomX, setRoomX] = useState(0)
    const [roomY, setRoomY] = useState(150)

    const mouseDown = (e) => {
        e.preventDefault();
        setMoved(true)
        setMouseXInitial(e.clientX)
        setMouseYInitial(e.clientY)
    }

    const onTouchDown = (e) => {
        setMoved(true)
        setMouseXInitial(e.changedTouches[0].clientX)
        setMouseYInitial(e.changedTouches[0].clientY)
    }

    const moveMouse = (e) => {
        if(moved) {
            let moveX = (e.clientX - mouseXInitial) / 4
            let moveY = (e.clientY - mouseYInitial) / 4

            setMouseXInitial(prev => prev + moveX)
            setMouseYInitial(prev => prev + moveY)
       
            setRoomX(prev => prev + moveX)
            setRoomY(prev => prev + moveY)
        }
    }

    const moverJanela = (e) => {
        if(movimentaJanela) {
            setPrimeiraOcorrencia(false)
            let moveX = (e.clientX - mouseXInitial) / 4
            let moveY = (e.clientY - mouseYInitial) / 4

            setMouseXInitial(prev => prev + moveX)
            setMouseYInitial(prev => prev + moveY)

            if (janela.x + moveX < 0) {
                setJanela(prev => {
                    return {...prev, x: 0, y: prev.y + moveY}
                })
            }
            if(janela.y + moveY < 0)  {
                setJanela(prev => {
                    return {...prev, x: prev.x + moveX, y: 0}
                })
            }
            if(janela.x + moveX >= 0 && janela.y + moveY >= 0) {
                setJanela(prev => {
                    return {...prev, x: e.clientX - 50, y: e.clientY - 25}
                })
            }
        }
    }

    const moverJanelaTouch = (e) => {
        if(movimentaJanela) {
            setPrimeiraOcorrencia(false)
            let moveX = (e.changedTouches[0].clientX - mouseXInitial) / 4
            let moveY = (e.changedTouches[0].clientY - mouseYInitial) / 4

            setMouseXInitial(prev => prev + moveX)
            setMouseYInitial(prev => prev + moveY)

            if (janela.x + moveX < 0) {
                setJanela(prev => {
                    return {...prev, x: 0, y: prev.y + moveY}
                })
            }
            if(janela.y + moveY < 0)  {
                setJanela(prev => {
                    return {...prev, x: prev.x + moveX, y: 0}
                })
            }
            if(janela.x + moveX >= 0 && janela.y + moveY >= 0) {
                setJanela(prev => {
                    return {...prev, x: e.changedTouches[0].clientX - 50, y: e.changedTouches[0].clientY - 25}
                })
            }
        }
    }

    const moveTouch = (e) => {
        if(moved) {
            let moveX = (e.changedTouches[0].clientX - mouseXInitial) / 4
            let moveY = (e.changedTouches[0].clientY - mouseYInitial) / 4

            setMouseXInitial(prev => prev + moveX)
            setMouseYInitial(prev => prev + moveY)
       
            setRoomX(prev => prev + moveX)
            setRoomY(prev => prev + moveY)
        }
    }

    return (
        <>
            <div style={{display: tela == "jogo" ? "inline" : "none"}}>
                <div className="painel-jogo" onTouchStart={(e) => { onTouchDown(e); }} onTouchEnd={(e) => setMoved(false)} onTouchMove={(e) => moveTouch(e)} onMouseDown={(e) => mouseDown(e)} onMouseUp={(e) => setMoved(false)} onMouseMove={(e) => moveMouse(e)}>
                    <Room roomX={roomX} roomY={roomY} />
                    <div onTouchMove={(e) => {e.stopPropagation(); moverJanelaTouch(e);}} onTouchStart={(e) => { setMovimentaJanela(true); setMouseXInitial(e.changedTouches[0].clientX); setMouseYInitial(e.changedTouches[0].clientY); }} style={{visibility: janela.visible ? "visible" : "hidden", left: primeiraOcorrencia ? "20%" : janela.x, top: janela.y, maxWidth: janela.larguraMaxima}} className="janela-login" onMouseDown={(e) => mouseDown(e)} onMouseUp={(e) => setMovimentaJanela(false)} onMouseDown={(e) => {e.preventDefault(); e.stopPropagation(); setMovimentaJanela(true); setMouseXInitial(e.clientX); setMouseYInitial(e.clientY);}} onMouseMove={(e) => {e.stopPropagation(); moverJanela(e); } } onMouseLeave={(e) => setMovimentaJanela(false) }>
                        <div style={{display: janela.login ? "grid" : "none"}}>
                            <div className="borda-cima-container">
                                <span className="borda-cima"></span>
                            </div>
                            <main className={styles.mainLogin}>
                                <h2>Entrar</h2>
                                <label htmlFor="nomeAvatarEmail">Nome do avatar / Email</label>
                                <input className={styles.input} type="text" id="nomeAvatarEmail" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }} />
                                <label htmlFor="senha">Senha</label>
                                <input className={styles.input} type="password" id="senha" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }} />
                                <span style={{textAlign: "right", textDecoration: "underline", cursor: "pointer"}} onClick={(e) => setJanela(prev => { return {...prev, login: false } })} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }}>Cadastrar nova conta</span>
                                <button className={"btn btn-secondary " + styles.entrarBtn} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => {setMovimentaJanela(false); e.stopPropagation(); }}>Entrar</button>
                            </main>
                            <div className="borda-cima-container">
                                <span className="borda-cima"></span>
                            </div>
                        </div>
                        <div style={{display: janela.login ? "none" : "grid"}}>
                            <div className="borda-cima-container">
                                <span className="borda-cima"></span>
                            </div>
                            <Cadastrar />
                            <div className="borda-cima-container">
                                <span className="borda-cima"></span>
                            </div>
                        </div>
                    </div>
                    <div className="footer" onMouseMove={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                        <div className="changeClothes"></div>
                        <div className="abrir-login-icon" onClick={(e) => setJanela(prev => { return {...prev, visible: !janela.visible}})}></div>
                    </div>
                </div>
            </div>
            <div className={styles.container} style={{display: tela == "home" ? "flex" : "none"}}>
                <h1>Entrar como:</h1>
                <div className={"row " + styles.linha}>
                    <div className="col-sm-6 d-grid gap-2">
                        <button className="button-3d button-3d-color-green"><i className="fa fa-user" aria-hidden="true"></i> Usuário</button>
                    </div>
                    <div className="col-sm-6 d-grid gap-2">
                        <button className="button-3d" onClick={() => setTela("jogo") }><i className="fa fa-user-circle" aria-hidden="true"></i> Convidado</button>
                    </div>
                </div>
            </div>
        </>
    )
}