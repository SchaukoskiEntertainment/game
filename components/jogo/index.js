import Room from "../room";
import { useEffect, useState } from "react"

export default function Jogo() {

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
            <div className="painel-jogo" onTouchStart={(e) => { onTouchDown(e); }} onTouchEnd={(e) => setMoved(false)} onTouchMove={(e) => moveTouch(e)} onMouseDown={(e) => mouseDown(e)} onMouseUp={(e) => setMoved(false)} onMouseMove={(e) => moveMouse(e)}>
                <Room roomX={roomX} roomY={roomY} />
            </div>
        </>
    )
}