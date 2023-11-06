const {WebSocketServer} = require("ws")

// 서버
const express = require("express")
const app = express()

app.use(express.static("public"))

app.listen(8888, () => {
    console.log(`Example app listening on port 8888`)
})

// 웹소켓 서버 생성
const wss = new WebSocketServer({port: 8001})
// broadcast 메소드 추가
// 웹소켓 서버 연결 이벤트 바인드
// wss.on("connection", ws => {
//     // 데이터 수신 이벤트 바인드
//     ws.on("message", data => {
//         console.log(`응답이 왔습니다::::: ${data}`)
//     })
// })

wss.on("connection", (ws, request) => {
    //브로드캐스트
    wss.clients.forEach(client => {
        // send 메소드를 사용하여 클라이언트에게 메세지 전송
        client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`)
    })
    // 데이터 수신 이벤트 바인드
    ws.on("message", data => {
        console.log(`응답이 왔습니다::::: ${data}`)
    })
    ws.on("close", () => {
        wss.clients.forEach((client) => {
            client.send(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
        });
    });
    // 채팅 내용 브로드캐스트하기
    ws.on("message", data => {
        wss.clients.forEach(client => {
            //클라이언트에서 전송되는 데이터를 서버에서 Blob으로 수신하기때문에
            //toString() 메소드로 String 으로 만들어야함
            client.send(data.toString())
        })
    })
    console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`)
})
