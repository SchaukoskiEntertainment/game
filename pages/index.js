import { useEffect, useState } from "react"
import Pusher from "pusher-js"

function Home({player}) {
    const [players, setPlayers] = useState([])
    const [rerender, setRerender] = useState(false)
    let allPlayers = []

    useEffect(() => {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        const pusher = new Pusher('de6a1ce47b72831bb023', {
            authEndpoint: "/api/pusher/auth",
            cluster: 'sa1',
        });

        var presenceChannel = pusher.subscribe('presence-game');

        presenceChannel.bind("pusher:subscription_succeeded", () => {
            presenceChannel.trigger("client-teste", {teste: "alo"});
            mostrarTodosJogadores(presenceChannel)
        });

        presenceChannel.bind("pusher:member_added", (member) => {
            var jogador = member.info.player
            adicionarJogador(jogador)
        });

        presenceChannel.bind("pusher:member_removed", (member) => {
            var jogador = member.info.player
            removerJogador(jogador)
        });

        presenceChannel.bind('client-teste', (data) => {
            console.log("Chamou")
        });

    }, [])

    const mostrarTodosJogadores = async (presenceChannel) => {
        presenceChannel.members.each(function (member) {
            var jogador = member.info.player
            adicionarJogador(jogador)
        });
    }

    const adicionarJogador = async (jogador) => {
        allPlayers.push(jogador)
        setPlayers(allPlayers);
        renderizaNovamente()
    }

    function removeObjectWithId(arr, id) {
        const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
        
        if (objWithIdIndex > -1) {
            arr.splice(objWithIdIndex, 1);
        }
        
        return arr;
    }

    const removerJogador = async (jogador) => {
        removeObjectWithId(allPlayers, jogador.id)
        setPlayers(allPlayers);
        renderizaNovamente()
    }

    const renderizaNovamente = async () => {
        const painelJogo = document.querySelector('.painel-jogo');
        painelJogo.click()
    }

    return <div>
        <div className="painel-jogo" onClick={(e) => setRerender(!rerender)}>
            {players.length}
            {
                players.map(p => (
                    <span className="player" style={{left:p.x, top: p.y}} key={p.id}></span>
                ))
            }
        </div>
    </div>
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