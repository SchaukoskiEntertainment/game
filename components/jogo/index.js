import Room from "../room";
import { useEffect, useState } from "react"

export default function Jogo() {

    const [moved, setMoved] = useState(false)
    const [mouseXInitial, setMouseXInitial] = useState(0)
    const [mouseYInitial, setMouseYInitial] = useState(0)
    const [roomX, setRoomX] = useState(0)
    const [roomY, setRoomY] = useState(150)

    const mouseDown = (e) => {
        event.preventDefault();
        setMoved(true)
        setMouseXInitial(e.clientX)
        setMouseYInitial(e.clientY)
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

    return (
        <>
            <div className="painel-jogo" onMouseLeave={(e) => setMoved(false)} onTouchStart={(e) => setMoved(true)} onTouchEnd={(e) => setMoved(false)} onTouchMove={(e) => moveMouse(e)} onMouseDown={(e) => mouseDown(e)} onMouseUp={(e) => setMoved(false)} onMouseMove={(e) => moveMouse(e)}>
                <Room roomX={roomX} roomY={roomY} />
            </div>
        </>
    )
}