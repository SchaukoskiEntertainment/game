import Image from 'next/image';
import Pusher from "pusher-js"
import { useEffect, useRef, useState, useMemo } from "react"
import Jogador from '../jogador';
import tileHover from '../../public/assets/tile-hover.png';
import PathFind from '../pathfind';
import worker_script from '../workers/movementWorker';

export default function Room({roomX, roomY}) {
    //PathFind
    let listaAberta = []
    let listaFechada = []

    const [result, setResult] = useState(null);
    let lastUpdate = Date.now()
    const [eu, setEu] = useState({})
    var offsetXPersonagem = 10
    var offsetYPersonagem = -33
    var playerSpeed = 160 / 2
    var jogadorVelocidadeBaixoCima = 80 / 2
    var jogadorVelocidadeOnly = 160 / 2

    const [jogadores, setJogadores] = useState([])
    const [tiles, setTiles] = useState([])
    const [pChannel, setPChannel] = useState({})
    let desativarWebsockets = false

    let roomSizeX = 5
    let roomSizeY = 5
    let allTiles = []
    const [hoverTileCoord, setHoverTileCoord] = useState({})
    const todosJogadores = useRef([]);
    const oEu = useRef({})

    let timer = Date.now()

    useEffect(() => {
        for(let i=0;i<jogadores.length;i++) {
            if (jogadores[i].vaiParaOTile) {
                jogadores[i].vaiParaOTile = false
                vaiParaOTile(jogadores[i], jogadores[i].vaiPara[0], jogadores[i].vaiPara)
                setJogadores(prev => prev.map(p => p.id === jogadores[i].id ? {...p, vaiParaOTile: false } : p))
            }
        }
        todosJogadores.current = jogadores
    }, [jogadores]);


    useEffect(() => {
        if (eu.adicionaPosicao) {
            eu.adiciona = true
            setEu(prev => {return {...prev, adiciona: true, adicionaPosicao:false}})
            pChannel.trigger("client-adiciona-jogador", eu);
        }
        oEu.current = eu
    }, [eu])


    useEffect(() => {
        if(tiles.length == roomSizeX) {
            requestAnimationFrame(tick)
        }
    }, [tiles])

    useEffect(() => {
        if (!desativarWebsockets) {
            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            const pusher = new Pusher('de6a1ce47b72831bb023', {
                authEndpoint: "/api/pusher/auth",
                cluster: 'sa1',
            });

            var presenceChannel = pusher.subscribe('presence-game');

            presenceChannel.bind("pusher:subscription_succeeded", (member) => {
                let jogador = {
                    id: member.myID,
                    tileCoord: {
                        x: 0, y: 0
                    },
                    currentAnimation: "idle-right"
                }
                setEu(jogador)
                adicionarJogador(jogador)
            });

            presenceChannel.bind("pusher:member_added", (member) => {
                let jogador = {
                    id: member.id,
                    tileCoord: {
                        x: 0, y: 0
                    },
                    currentAnimation: "idle-right"
                }

                // Adiciona na posição 0, 0
                adicionarJogador(jogador)

                // Altera estado do eu para disparar o trigger
                setEu(prev => {return {...prev, adicionaPosicao:true}})
            });

            presenceChannel.bind("pusher:member_removed", (jogador) => {
                //var jogador = member.info.player
                removerJogador(jogador)
            });

            presenceChannel.bind('client-atualiza-posicao', (jogador) => {
                let vaiParaOTile = false
                if(jogador.vaiPara && jogador.vaiPara.length != 0) {
                    vaiParaOTile = true
                }
                //setJogadores(prev => prev.map(p => p.id === jogador.id ? {...p, tileCoord: jogador.tileCoord, x: jogador.x, y: jogador.y, vaiPara: jogador.vaiPara, vaiParaOTile } : p))
                setJogadores(prev => {
                    prev = prev.map(p => p.id === jogador.id ? {...p, tileCoord: jogador.tileCoord, x: jogador.x, y: jogador.y, vaiPara: jogador.vaiPara, vaiParaOTile } : p)
                    todosJogadores.current = prev
                    return prev
                })
            });

            presenceChannel.bind('client-adiciona-jogador', (jogador) => {
                if(jogador.adiciona) {
                    // Não adiciona jogador caso encontrar o mesmo
                    setJogadores(prev => {
                        if(!prev.find((j) => j.id == jogador.id)) {
                            return [...prev, {...jogador, vaiParaOTile: jogador.vaiPara && jogador.vaiPara.length > 0 ? true : false}]
                        } else {
                            return prev
                        }
                    })
                }
            });

            setPChannel(presenceChannel)

            document.addEventListener("visibilitychange", function () {
                if(!document.hidden) {
                    /*let tempTimer = Math.floor((Date.now() - timer) / 1000);

                    const deltaTime = (Date.now() - timer) / 1000;
                    const movimentoJogador = jogadorVelocidadeBaixoCima * deltaTime*/
                } else {
                    /*timer = Date.now()*/
                    //presenceChannel.trigger("client-atualiza-posicao-request", {});
                }
            });
        }

        var widthHalfTile = 26
        var marginLeft = (widthHalfTile * roomSizeY) - widthHalfTile
        var tileHeight = 27

        for(var x=0; x<roomSizeX; x++) {
            var yArray = []
            for(var y=0; y<roomSizeY; y++) {
                yArray.push({
                    id: "tile-"+x+"-"+y,
                    x: (x+25*x)-(y*26)+(marginLeft),
                    y: (x+12*x)+(y*13)
                })
            }
            allTiles.push(yArray)
        }

        setTiles(allTiles)

        var tileWidth = 55
        var halfTile = tileWidth / 2
        var nextTilesHalf = 26
        let tileHeightHalf = 13

        let room = document.getElementById("room");
        room.style.width = (((halfTile * 2) + (nextTilesHalf * (roomSizeX - 1))) + 2) + marginLeft + "px"
        //room.style.height = ((14) + tileHeight * roomSizeY) - 2 + "px"
        room.style.height = (((roomSizeX+12*roomSizeX)+(roomSizeY*13)) + tileHeightHalf + 4) + "px"


        //x: (x+25*x)-(y*26)+(marginLeft),
        //y: (x+12*x)+(y*13)
    }, [])

    useEffect(() => {
        //var myInterval = setInterval(tick, 0);
        //requestAnimationFrame(tick)
        /*lastUpdate = Date.now()
        const worker = new Worker(worker_script);
        worker.postMessage("Inicia loop");
        worker.onmessage = event => setResult(event.data); */
    }, [])

    function tick() {
        var now = Date.now();
        var deltaTime = (now - lastUpdate) / 1000;
        lastUpdate = now;
        update(deltaTime);
        requestAnimationFrame(tick)
    }

    const update = (deltaTime) => {
        let jogadores = todosJogadores.current
        let eu = oEu.current
        for(let i=0;i<jogadores.length;i++) {
            if (jogadores[i].podeMovimentar) {
                let podeMovimentar = jogadores[i].podeMovimentar
                let jogador = jogadores[i]

                jogador.x = parseFloat(jogador.x)
                jogador.y = parseFloat(jogador.y)

                //Baixo Direita
                let fim = false
                if (jogador.tileCoord.x + 1 == podeMovimentar.tileCoord.x && jogador.tileCoord.y == podeMovimentar.tileCoord.y) {
                    var baixo = false
                    if (jogador.y + jogadorVelocidadeBaixoCima * deltaTime < parseInt(podeMovimentar.y) + offsetYPersonagem) {
                        //Baixo
                        jogador.y += jogadorVelocidadeBaixoCima * deltaTime
                    } else {
                        baixo = true
                    }

                    var direita = false
                    if (jogador.x + playerSpeed * deltaTime < parseInt(podeMovimentar.x) + offsetXPersonagem) {
                        //Direita
                        jogador.x += playerSpeed * deltaTime
                    } else {
                        direita = true
                    }

                    if(direita && baixo) {
                        fim = true
                        jogador.currentAnimation = "idle-right"
                    } else {
                        jogador.currentAnimation = "walking-right"
                    }
                }

                //Baixo
                if (jogador.tileCoord.x + 1 == podeMovimentar.tileCoord.x && jogador.tileCoord.y + 1 == podeMovimentar.tileCoord.y) {
                    var baixo = false
                    if (jogador.y + jogadorVelocidadeOnly * deltaTime < parseInt(podeMovimentar.y) + offsetYPersonagem) {
                        //Baixo
                        jogador.y += jogadorVelocidadeOnly * deltaTime
                    } else {
                        baixo = true
                    }

                    if(baixo) {
                        fim = true
                    }
                }

                //Baixo Esquerda
                if (jogador.tileCoord.x == podeMovimentar.tileCoord.x && jogador.tileCoord.y + 1 == podeMovimentar.tileCoord.y) {
                    var baixo = false
                    if (jogador.y + jogadorVelocidadeBaixoCima * deltaTime < parseInt(podeMovimentar.y) + offsetYPersonagem) {
                        //Baixo
                        jogador.y += jogadorVelocidadeBaixoCima * deltaTime
                    } else {
                        baixo = true
                    }

                    var esquerda = false
                    if (jogador.x - playerSpeed * deltaTime > parseInt(podeMovimentar.x) + offsetXPersonagem) {
                        //Direita
                        jogador.x -= playerSpeed * deltaTime
                    } else {
                        esquerda = true
                    }

                    if(esquerda && baixo) {
                        fim = true
                        jogador.currentAnimation = "idle-left"
                    } else {
                        jogador.currentAnimation = "walking-left"
                    }
                }


                //Diagonal Esquerda
                if (jogador.tileCoord.x - 1 == podeMovimentar.tileCoord.x && jogador.tileCoord.y + 1 == podeMovimentar.tileCoord.y) {
                    var esquerda = false
                    if (jogador.x - (jogadorVelocidadeOnly * 2) * deltaTime > parseInt(podeMovimentar.x) + offsetXPersonagem) {
                        //Direita
                        jogador.x -= (jogadorVelocidadeOnly * 2) * deltaTime
                    } else {
                        esquerda = true
                    }

                    if(esquerda) {
                        fim = true
                    }
                }

                //Cima Esquerda
                if (jogador.tileCoord.x - 1 == podeMovimentar.tileCoord.x && jogador.tileCoord.y == podeMovimentar.tileCoord.y) {
                    var cima = false
                    if (jogador.y - jogadorVelocidadeBaixoCima * deltaTime > parseInt(podeMovimentar.y) + offsetYPersonagem) {
                        //Baixo
                        jogador.y -= jogadorVelocidadeBaixoCima * deltaTime
                    } else {
                        cima = true
                    }

                    var esquerda = false
                    if (jogador.x - playerSpeed * deltaTime > parseInt(podeMovimentar.x) + offsetXPersonagem) {
                        jogador.x -= playerSpeed * deltaTime
                    } else {
                        esquerda = true
                    }

                    if(esquerda && cima) {
                        fim = true
                    }
                }

                //Cima
                if (jogador.tileCoord.x - 1 == podeMovimentar.tileCoord.x && jogador.tileCoord.y - 1 == podeMovimentar.tileCoord.y) {
                    var cima = false
                    if (jogador.y - jogadorVelocidadeOnly * deltaTime > parseInt(podeMovimentar.y) + offsetYPersonagem) {
                        jogador.y -= jogadorVelocidadeOnly * deltaTime
                    } else {
                        cima = true
                    }

                    if(cima) {
                        fim = true
                    }
                }

                //Cima Direita
                if (jogador.tileCoord.x == podeMovimentar.tileCoord.x && jogador.tileCoord.y - 1 == podeMovimentar.tileCoord.y) {
                    var cima = false
                    if (jogador.y - jogadorVelocidadeBaixoCima * deltaTime > parseInt(podeMovimentar.y) + offsetYPersonagem) {
                        //Baixo
                        jogador.y -= jogadorVelocidadeBaixoCima * deltaTime
                    } else {
                        cima = true
                    }

                    var direita = false
                    if (jogador.x + playerSpeed * deltaTime < parseInt(podeMovimentar.x) + offsetXPersonagem) {
                        jogador.x += playerSpeed * deltaTime
                    } else {
                        direita = true
                    }

                    if(direita && cima) {
                        fim = true
                    }
                }

                //Diagonal Direita
                if (jogador.tileCoord.x + 1 == podeMovimentar.tileCoord.x && jogador.tileCoord.y - 1 == podeMovimentar.tileCoord.y) {
                    var direita = false
                    if (jogador.x + (jogadorVelocidadeOnly * 2) * deltaTime < parseInt(podeMovimentar.x) + offsetXPersonagem) {
                        //Direita
                        jogador.x += (jogadorVelocidadeOnly * 2) * deltaTime
                    } else {
                        direita = true
                    }

                    if(direita) {
                        fim = true
                    }
                }

                if (!fim) {
                    //setJogadores(prev => prev.map(p => p.id === jogador.id ? {...p, x: jogador.x, y: jogador.y} : p))
                    setJogadores(prev => {
                        prev = prev.map(p => p.id === jogador.id ? {...p, x: jogador.x, y: jogador.y} : p)
                        todosJogadores.current = prev
                        return prev
                    })
                }

                if(fim) {
                    setJogadores(prev => {
                        prev = prev.map(p => p.id === jogador.id ? {...p, tileCoord: podeMovimentar.tileCoord, x: podeMovimentar.x + offsetXPersonagem, y: podeMovimentar.y + offsetYPersonagem} : p)
                        todosJogadores.current = prev
                        return prev
                    })

                    jogador.vaiPara.shift()

                    if(jogador.id == eu.id) {
                        setEu(prev => { 
                            oEu.current = {...prev, x: jogador.x, y: jogador.y, vaiPara: jogador.vaiPara, tileCoord: { x: podeMovimentar.tileCoord.x, y: podeMovimentar.tileCoord.y }}
                            return {...prev, x: jogador.x, y: jogador.y, vaiPara: jogador.vaiPara, tileCoord: { x: podeMovimentar.tileCoord.x, y: podeMovimentar.tileCoord.y }} 
                        })
                    }

                    if (jogador.vaiPara.length != 0) {
                        vaiParaOTile(jogador, jogador.vaiPara[0], jogador.vaiPara)
                    } else {
                        setJogadores(prev => {
                            prev = prev.map(p => p.id === jogador.id ? {...p, vaiPara: [], podeMovimentar: false, removeAnimation: true} : p)
                            todosJogadores.current = prev
                            return prev
                        })
                    }

                    setJogadores(prev => {
                        prev = prev.map(p => p.id === jogador.id ? {...p, x: podeMovimentar.x + offsetXPersonagem, y: podeMovimentar.y + offsetYPersonagem, animation: false} : p)
                        todosJogadores.current = prev
                        return prev
                    })
                    return
                }
            }
        }
    }


    const adicionaNosVizinhos = (noAtual, nodeFinal) => {
        // Cima
        let nodeCima = verificaNodeFora({
            x: noAtual.x,
            y: noAtual.y - 1,
            f: (noAtual.g + 10) + (Math.abs(nodeFinal.x - (noAtual.x)) + Math.abs(nodeFinal.y - (noAtual.y - 1))) * 10,
            g: noAtual.g + 10,
            h: (Math.abs(nodeFinal.x - (noAtual.x)) + Math.abs(nodeFinal.y - (noAtual.y - 1))) * 10,
            noPai: noAtual
        })
        if (nodeCima) {
            listaAberta.push(nodeCima)
        }
        //Superior direito
        let nodeSuperiorDireito = verificaNodeFora({
            x: noAtual.x + 1,
            y: noAtual.y - 1,
            f: (noAtual.g + 14) + (Math.abs(nodeFinal.x - (noAtual.x + 1)) + Math.abs(nodeFinal.y - (noAtual.y - 1))) * 10,
            g: noAtual.g + 14,
            h: (Math.abs(nodeFinal.x - (noAtual.x + 1)) + Math.abs(nodeFinal.y - (noAtual.y - 1))) * 10,
            noPai: noAtual
        })
        if (nodeSuperiorDireito) {
            listaAberta.push(nodeSuperiorDireito)
        }
        //Direita
        let nodeDireita = verificaNodeFora({
            x: noAtual.x + 1,
            y: noAtual.y,
            f: (noAtual.g + 10) + (Math.abs(nodeFinal.x - (noAtual.x + 1)) + Math.abs(nodeFinal.y - (noAtual.y))) * 10,
            g: noAtual.g + 10,
            h: (Math.abs(nodeFinal.x - (noAtual.x + 1)) + Math.abs(nodeFinal.y - (noAtual.y))) * 10,
            noPai: noAtual
        })
        if (nodeDireita) {
            listaAberta.push(nodeDireita)
        }
        //Inferior direito
        let nodeInferiorDireito = verificaNodeFora({
            x: noAtual.x + 1,
            y: noAtual.y + 1,
            f: (noAtual.g + 14) + (Math.abs(nodeFinal.x - (noAtual.x + 1)) + Math.abs(nodeFinal.y - (noAtual.y + 1))) * 10,
            g: noAtual.g + 14,
            h: (Math.abs(nodeFinal.x - (noAtual.x + 1)) + Math.abs(nodeFinal.y - (noAtual.y + 1))) * 10,
            noPai: noAtual
        })
        if (nodeInferiorDireito) {
            listaAberta.push(nodeInferiorDireito)
        }
        //Baixo
        let nodeBaixo = verificaNodeFora({
            x: noAtual.x,
            y: noAtual.y + 1,
            f: (noAtual.g + 10) + (Math.abs(nodeFinal.x - (noAtual.x)) + Math.abs(nodeFinal.y - (noAtual.y + 1))) * 10,
            g: noAtual.g + 10,
            h: (Math.abs(nodeFinal.x - (noAtual.x)) + Math.abs(nodeFinal.y - (noAtual.y + 1))) * 10,
            noPai: noAtual
        })
        if (nodeBaixo) {
            listaAberta.push(nodeBaixo)
        }
        //Inferior esquerdo
        let nodeInferiorEsquerdo = verificaNodeFora({
            x: noAtual.x - 1,
            y: noAtual.y + 1,
            f: (noAtual.g + 14) + (Math.abs(nodeFinal.x - (noAtual.x - 1)) + Math.abs(nodeFinal.y - (noAtual.y + 1))) * 10,
            g: noAtual.g + 14,
            h: (Math.abs(nodeFinal.x - (noAtual.x - 1)) + Math.abs(nodeFinal.y - (noAtual.y + 1))) * 10,
            noPai: noAtual
        })
        if (nodeInferiorEsquerdo) {
            listaAberta.push(nodeInferiorEsquerdo)
        }
        //Esquerda
        let nodeEsquerda = verificaNodeFora({
            x: noAtual.x - 1,
            y: noAtual.y,
            f: (noAtual.g + 10) + (Math.abs(nodeFinal.x - (noAtual.x - 1)) + Math.abs(nodeFinal.y - (noAtual.y))) * 10,
            g: noAtual.g + 10,
            h: (Math.abs(nodeFinal.x - (noAtual.x - 1)) + Math.abs(nodeFinal.y - (noAtual.y))) * 10,
            noPai: noAtual
        })
        if (nodeEsquerda) {
            listaAberta.push(nodeEsquerda)
        }
        //Superior Esquerdo
        let nodeSuperiorEsquerdo = verificaNodeFora({
            x: noAtual.x - 1,
            y: noAtual.y - 1,
            f: (noAtual.g + 14) + (Math.abs(nodeFinal.x - (noAtual.x - 1)) + Math.abs(nodeFinal.y - (noAtual.y - 1))) * 10,
            g: noAtual.g + 14,
            h: (Math.abs(nodeFinal.x - (noAtual.x - 1)) + Math.abs(nodeFinal.y - (noAtual.y - 1))) * 10,
            noPai: noAtual
        })
        if (nodeSuperiorEsquerdo) {
            listaAberta.push(nodeSuperiorEsquerdo)
        }

    }

    const verificaNodeFora = (node) => {
        //Verifica se ja existe na lista aberta
        for(let i=0;i<listaAberta.length;i++) {
            if (listaAberta[i].x == node.x && listaAberta[i].y == node.y)
            {
                return null
            }
        }

        //Verifica se ja existe na lista fechada
        for(let i=0;i<listaFechada.length;i++) {
            if (listaFechada[i].x == node.x && listaFechada[i].y == node.y)
            {
                return null
            }
        }

        if (node.y < 0 || node.y >= roomSizeY || node.x < 0 || node.x >= roomSizeX) {
            return null
        } else {
            return node
        }
    } 

    const startPathFind = (eu) => {
        if (hoverTileCoord.visible) {
            listaAberta = []
            listaFechada = []
            let nodeFinal = hoverTileCoord.tileCoord
            let nodeInicial = {
                x: eu.tileCoord.x,
                y: eu.tileCoord.y,
                f: 0,
                g: 0,
                h: 0,
                noPai: null
            }
            listaAberta.push(nodeInicial)
            let noFinal = null
            while(noFinal == null) {
                let menor = 9999
                let noAtual = null
                let nodeMenorIndex = null
                for(let i=0;i<listaAberta.length;i++) {
                    if(listaAberta[i].f < menor) {
                        nodeMenorIndex = i
                        menor = listaAberta[i].f
                    }
                }
                //Remove o menor nó f
                listaFechada.push(listaAberta[nodeMenorIndex])
                noAtual = listaAberta[nodeMenorIndex]
                listaAberta.splice(nodeMenorIndex, 1)
                if(!noAtual) {
                    return
                }

                adicionaNosVizinhos(noAtual, nodeFinal)

                //Verifica se achou nó com custo h = 0
                for(let i=0;i<listaAberta.length;i++) {
                    if(listaAberta[i].h == 0) {
                        noFinal = listaAberta[i]
                    }
                }
            }
            movimentaJogador(noFinal, eu)
        }
    }

    const setJogadorNoTile = (jogador, tile) => {
        let XY = tileCoordToXY2(tile.tileCoord)
        jogador.x = parseInt(XY.x) + offsetXPersonagem
        jogador.y = parseInt(XY.y) + offsetYPersonagem
        setJogadores(prev => prev.map(p => p.id === jogador.id ? {...p, tileCoord: tile.tileCoord, x: jogador.x, y: jogador.y} : p))
    }

    const selecionaTile = (e) => {
        if (tiles.length) {
            let rect = document.getElementById("room").getBoundingClientRect();
            let mousePos = {x: e.clientX - rect.left, y: e.clientY - rect.top}
            let tileWidthHalf = 26
            let tileHeightHalf = 13

            mousePos.x += (26) * roomSizeY
            let tileX = Math.floor(0.5 * ( mousePos.x / tileWidthHalf + mousePos.y / tileHeightHalf)) - roomSizeY
            let tileY = Math.floor(0.5 * (-mousePos.x / tileWidthHalf + mousePos.y / (tileHeightHalf))) + roomSizeY

            if(!(tileY > roomSizeY - 1 || tileY < 0 || tileX < 0 || tileX > roomSizeX - 1)) {
                let tile = tiles[tileX][tileY]
                setHoverTileCoord({tileCoord: {x: tileX, y: tileY}, x: tile.x, y: tile.y, visible: true})
            } else {
                setHoverTileCoord((prev) => {
                    return {...prev, visible: false}
                })
            }
        }
    }

    const mostrarOutrosJogadores = async (presenceChannel) => {
        presenceChannel.members.each(function (member) {
            var jogador = member.info.player
            // Se não for eu
            if (presenceChannel.members.me.id != member.id) {
                adicionarJogador(jogador)
            }
        });
    }

    const tileCoordToXY = (tileCoord) => {
        return {x: allTiles[tileCoord.x][tileCoord.y].x, y: allTiles[tileCoord.x][tileCoord.y].y}
    }

    const tileCoordToXY2 = (tileCoord) => {
        return {x: tiles[tileCoord.x][tileCoord.y].x, y: tiles[tileCoord.x][tileCoord.y].y}
    }

    const adicionarJogador = async (jogador) => {
        let XY = tileCoordToXY(jogador.tileCoord)
        jogador.x = parseInt(XY.x) + offsetXPersonagem
        jogador.y = parseInt(XY.y) + offsetYPersonagem
        setJogadores(prev => [...prev, jogador]);
    }

    const clicouNoTile = (e) => {
        if (hoverTileCoord.visible) {
            if (!eu.vaiPara) {
                eu.vaiPara = []
            }
            selecionaTile(e)
            if (eu.vaiPara.length == 0 && !(hoverTileCoord.x == eu.tileCoord.x && hoverTileCoord.y == eu.tileCoord.y) ) {
                setEu(prevEu => {
                    oEu.current = prevEu
                    return {...prevEu, startPathFind: true}
                })
                startPathFind(oEu.current)
            }
        }
    }

    function removeObjectWithId(arr, id) {
        const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
        
        if (objWithIdIndex > -1) {
            arr.splice(objWithIdIndex, 1);
        }
        
        return arr;
    }

    const removerJogador = async (jogador) => {
        setJogadores(prev => prev.filter(p => p.id !== jogador.id));
    }

    const vaiParaOTile = (jogador, tile, arrayVaiPara) => {
        let tileDom = tiles[tile.x][tile.y]
        tileDom.tileCoord = {x: tile.x, y: tile.y}

        // Atualiza jogador baseado no último tile andado
        if (jogador.podeMovimentar) {
            setJogadores(prev => {
                prev = prev.map(p => p.id === jogador.id ? {...p, x: jogador.podeMovimentar.x + offsetXPersonagem, y: jogador.podeMovimentar.y + offsetYPersonagem } : p)
                todosJogadores.current = prev
                return prev
            })
        }
        comecaMovimentacaoDeUmJogador(jogador, tileDom, arrayVaiPara)
    }

    const comecaMovimentacaoDeUmJogador = (jogador, tileDom, arrayVaiPara) => {
        let jogadores = todosJogadores.current
        for(let i=0;i<jogadores.length;i++) {
            if (jogadores[i].id == jogador.id) {
                // Atualiza jogador
                // todo, colocar o current
                //setJogadores(prev => prev.map(p => p.id === jogador.id ? {...p, vaiPara: arrayVaiPara, podeMovimentar: tileDom} : p))
                // setJogadores(prev => {
                //     todosJogadores.current = prev
                //     return prev
                // })
                setJogadores(prev => {
                    prev = prev.map(p => p.id === jogador.id ? {...p, vaiPara: arrayVaiPara, podeMovimentar: tileDom} : p)
                    todosJogadores.current = prev
                    return prev
                })
                break;
            }
        }
    }

    const movimentaJogador = (noFinal, jogador) => {
        let array = []
        let node = noFinal
        while(node != null) {
            node = node.noPai
            if(node) {
                array.push({x: node.x, y: node.y})
            }
        }
        array.reverse()
        array.push({x: noFinal.x, y: noFinal.y})
        array.shift()


        jogador.vaiPara = array
        jogador.adiciona = false
        pChannel.trigger("client-atualiza-posicao", jogador);

        vaiParaOTile(jogador, array[0], array)
    }

    const changeColor = (color) => {
        setJogadores(prev => prev.map(p => p.id === eu.id ? {...p, pantsColor: color } : p))
    }

    return (
        <>
            <div id="room" style={{left: roomX, top: roomY}} onMouseMove={(e) => selecionaTile(e)}>
                {
                    tiles.map((tileY) => (
                        tileY.map((tile) => (
                            <div onClick={(e) => clicouNoTile(e)} key={tile.id} className="tile" style={{left: tile.x, top: tile.y}}>
                                <div id={tile.id} style={{position: "absolute", backgroundImage: `url(assets/tile-down.png)`, backgroundRepeat: "no-repeat", width:55, height:41 }} alt="tile"></div>
                            </div>
                        ))
                    ))
                }
                <Image id='hoverTile' style={{visibility: hoverTileCoord.visible ? "visible" : "hidden", left: hoverTileCoord.x, top: hoverTileCoord.y, position: "absolute", display: "block", pointerEvents: "none"}} alt="hover-tile" src={tileHover} unoptimized priority />
                {
                    jogadores.map(p => (
                        <Jogador key={p.id} jogador={p} eu_id={eu.id} />
                    ))
                }
            </div>
            <div className="footer">
                <div className="pantsColorRed" onClick={() => changeColor("red")}></div>
                <div className="pantsColorGreen" onClick={() => changeColor("green")}></div>
            </div>
        </>
    )
}