import body from '../../public/assets/body.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Jogador({ jogador, eu_id }) {
    const [outroJogador, setOutroJogador] = useState(false)
    const [pantsColor, setPantsColor] = useState("green")

    const euStyle = {
        position: "absolute",
        pointerEvents: "none"
    }

    const outroJogadorStyle = {
        opacity: 0.5,
        position: "absolute",
        pointerEvents: "none"
    }

    const currentAnimation = jogador.currentAnimation

    return (
        <div style={Object.assign(eu_id == jogador.id ? euStyle : outroJogadorStyle)} >
            <div style={{ display: currentAnimation == "idle-right" || currentAnimation == "idle-left" ? "block" : "none" }}>
                <div style={{ transform: currentAnimation == "idle-right" ? "scaleX(1)" : "scaleX(-1)", position: "absolute", backgroundImage: `url(assets/new-body.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "idle-right-up" || currentAnimation == "idle-left-up" ? "block" : "none" }}>
                <div style={{ transform: currentAnimation == "idle-right-up" ? "scaleX(1)" : "scaleX(-1)", position: "absolute", backgroundImage: `url(assets/new-body-up-right.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "idle-back" ? "block" : "none" }}>
                <div style={{ position: "absolute", backgroundImage: `url(assets/new-body-back.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "idle-front" ? "block" : "none" }}>
                <div style={{ position: "absolute", backgroundImage: `url(assets/new-body-front.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "idle-right-only" || currentAnimation == "idle-left-only" ? "block" : "none" }}>
                <div style={{ transform: currentAnimation == "idle-right-only" ? "scaleX(1)" : "scaleX(-1)", position: "absolute", backgroundImage: `url(assets/new-body-right.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "walking-right" || currentAnimation == "walking-left" ? "block" : "none" }}>
                <div style={{ transform: currentAnimation == "walking-right" ? "scaleX(1)" : "scaleX(-1)", animation: "animacaoAvatar 0.4s steps(5) infinite", position: "absolute", backgroundImage: `url(assets/new-body-walking.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "walking-right-up" || currentAnimation == "walking-left-up" ? "block" : "none" }}>
                <div style={{ transform: currentAnimation == "walking-right-up" ? "scaleX(1)" : "scaleX(-1)", animation: "animacaoAvatar 0.4s steps(5) infinite", position: "absolute", backgroundImage: `url(assets/new-body-walking-up-right.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "walking-back" ? "block" : "none" }}>
                <div style={{ animation: "animacaoAvatar 0.4s steps(5) infinite", position: "absolute", backgroundImage: `url(assets/new-body-walking-back.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "walking-front" ? "block" : "none" }}>
                <div style={{ animation: "animacaoAvatar 0.4s steps(5) infinite", position: "absolute", backgroundImage: `url(assets/new-body-walking-front.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{ display: currentAnimation == "walking-right-only" || currentAnimation == "walking-left-only" ? "block" : "none" }}>
                <div style={{ transform: currentAnimation == "walking-right-only" ? "scaleX(1)" : "scaleX(-1)", animation: "animacaoAvatar 0.4s steps(5) infinite", position: "absolute", backgroundImage: `url(assets/new-body-walking-right.png)`, backgroundRepeat: "no-repeat", width: 62, height: 87, left: jogador.x, top: jogador.y }}></div>
            </div>
        </div>
    )
}