import { 
    View,
    Image
 } from "react-native"

 import { useEffect, useState } from "react";
 
 
const bb = require("../node_modules/react-native-chessboard/src/assets/bb.png");
const bk = require("../node_modules/react-native-chessboard/src/assets/bk.png");
const bn = require("../node_modules/react-native-chessboard/src/assets/bn.png");
const bp = require("../node_modules/react-native-chessboard/src/assets/bp.png");
const bq = require("../node_modules/react-native-chessboard/src/assets/bq.png");
const br = require("../node_modules/react-native-chessboard/src/assets/br.png");
const wb = require("../node_modules/react-native-chessboard/src/assets/wb.png");
const wk = require("../node_modules/react-native-chessboard/src/assets/wk.png");
const wn = require("../node_modules/react-native-chessboard/src/assets/wn.png");
const wp = require("../node_modules/react-native-chessboard/src/assets/wp.png");
const wq = require("../node_modules/react-native-chessboard/src/assets/wq.png");
const wr = require("../node_modules/react-native-chessboard/src/assets/wr.png");
const pieces = "qkbnrpPQKBNR";

const chessboardWhite = "#D9FDF8";
const chessboardBlack = "#62B1A8";

// Have to use this for rendering chessboards on homescreen
// Cause react-native-chessboard was way too hefty
export default function Chessboard({fen, size})
{
    const [board, setBoard] = useState([[], [], [], [], [], [], [], []])
    const [position, setPosition] = useState<string | undefined>(fen);

    // Convert fen to board
    useEffect(() => {

        let fenStr: string = fen;
        let idx = fenStr.indexOf(" ");
        let fen1: string = fenStr.slice(0, idx);

        let newBoard = [[], [], [], [], [], [], [], []];

        let row  = 0;
        for (let i = 0; i < fen1.length; i++)
        {
            if (pieces.includes(fen1[i]))
            {
                newBoard[row].push(fen1[i]);
            }
            else if (!isNaN(parseInt(fen1[i], 10)))
            {
                let n = parseInt(fen1[i], 10);

                for (let j = 0; j < n; j++)
                {
                    newBoard[row].push("");
                }
            }
            else if (fen1[i] == "/")
            {
                row++;
            }
        }

        setBoard(newBoard)

    }, [fen])
    
    const Cell = ({piece, squareColor}) => (
        <View style={{backgroundColor: squareColor, borderWidth: .1, flex: 1}}>
            {(piece != null) && <Image source={piece} style={{width: size / 8, height: size / 8}}/>}
        </View>
    )

    return (
        <View style={{
            width: size, 
            height: size
        }}>
            {
                board.map((row, i) => {
                    return (
                        <View style={{flex: 1, flexDirection: 'row'}} key={i}>
                            {row.map((piece, j) => {

                                let color:string;
                                if (i % 2 == 0)
                                {
                                    if (j % 2 == 0)
                                        color = chessboardWhite;
                                    else
                                        color = chessboardBlack;
                                }
                                else
                                {
                                    if (j % 2 == 0)
                                        color = chessboardBlack;
                                    else
                                        color = chessboardWhite;
                                }

                                let image = null;
                                switch (piece)
                                {
                                    case "p":
                                        image = bp;
                                        break;
                                    case "r":
                                        image = br;
                                        break;
                                    case "n":
                                        image = bn;
                                        break;
                                    case "b":
                                        image = bb;
                                        break;
                                    case "q":
                                        image = bq;
                                        break;
                                    case "k":
                                        image = bk;
                                        break;
                                    case "P":
                                        image = wp;
                                        break;
                                    case "R":
                                        image = wr;
                                        break;
                                    case "N":
                                        image = wn;
                                        break;
                                    case "B":
                                        image = wb;
                                        break;
                                    case "Q":
                                        image = wq;
                                        break;
                                    case "K":
                                        image = wk;
                                        break;
                                }

                                return <Cell piece={image} squareColor={color} key={j}/>
                            })}
                        </View>
                    )
                })
            }
        </View>
    )
}