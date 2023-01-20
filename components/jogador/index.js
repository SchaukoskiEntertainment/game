import body from '../../public/assets/body.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Jogador({jogador, eu_id}) {
    const [outroJogador, setOutroJogador] = useState(false)

    const euStyle = {
        position: "absolute"
    }

    const outroJogadorStyle = {
        opacity: 0.5,
        position: "absolute"
    }

    const currentAnimation = jogador.currentAnimation

    return (
        <div style={Object.assign(eu_id == jogador.id ? euStyle : outroJogadorStyle)} >
            <div style={{display: currentAnimation == "idle-right" || currentAnimation == "idle-left"  ? "block" : "none"}}>
                <div style={{transform: currentAnimation == "idle-right" ? "scaleX(1)" : "scaleX(-1)", position: "absolute", backgroundImage: `url(assets/body.png)`, backgroundRepeat: "no-repeat", width:38, height:55, left: jogador.x, top: jogador.y }}></div>
                <div style={{transform: currentAnimation == "idle-right" ? "scaleX(1)" : "scaleX(-1)", position: "absolute", backgroundImage: `url(assets/pants-idle.png)`, backgroundRepeat: "no-repeat", width:38, height:55, left: jogador.x, top: jogador.y }}></div>
            </div>
            <div style={{display: currentAnimation == "walking-right" || currentAnimation == "walking-left" ? "block" : "none"}}>
                <div style={{transform: currentAnimation == "walking-right" ? "scaleX(1)" : "scaleX(-1)", animation: "animacaoAvatar 0.8s steps(4) infinite", position: "absolute", backgroundImage: `url(assets/body-walking.png)`, backgroundRepeat: "no-repeat", width:38, height:55, left: jogador.x, top: jogador.y }}></div>
                <div style={{transform: currentAnimation == "walking-right" ? "scaleX(1)" : "scaleX(-1)", animation: "animacaoAvatar 0.8s steps(4) infinite", position: "absolute", backgroundImage: `url(assets/pants-walking.png)`, backgroundRepeat: "no-repeat", width:38, height:55, left: jogador.x, top: jogador.y }}></div>
            </div>
        </div>
    )
}