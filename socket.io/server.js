const express = require('express');
const http = require('http');
const { send } = require('process');
// node.js 기본 내장 모듈인 'http' 불러오기.
// 'http' 모듈은 HTTP 서버와 클라이언트 기능을 제공.

const socketIO = require('socket.io');
// 'socket.io' 모듈 불러오기.
// WebSocket 기반, 실시간 양방향 데이터 전송 지원 라이브러리.

const app = express();
const server = http.createServer(app);
// Express 애플리케이션 기반으로 HTTP 서버 생성.

const io = socketIO(server)
// HTTP 서버 'server'를 'socket.io'에 바인딩하여 WebSocket 기능을 추가한 서버를 생성.
// 이러면 클라이언트-서버 간에 실시간 양방향 통신을 할 수 있음.

const PORT = 8080;

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('client');
})

// [실습 3-2-1]
// 사용자 닉네임 모음 객체
const nickObjs = {};

// [실습 3-2-3]
// 유저 목록 업데이트
function updateList() {
    io.emit('updateNicks', nickObjs) // 전체 사용자 닉네임 모음 객체 전달
}

// io.on() : socket 관련한 통신 작업을 처리
io.on('connection', (socket) => {
    // connection 이벤트는 클라이언트가 접속 했을 때 발생
    console.log('서버 연결 완료 :: ', socket.id);
    // socket.id : 소켓 고유 아이디 (브라우저 탭 단위)
    // (참고) 소켓 연결 완료.

    // [실습 1]
    // socket.on('hello', (data) => {
    //     console.log(data);
    //     console.log(`${data.who} : ${data.msg}`);
    //     socket.emit('hellokr', {who: 'hello', msg: '안녕!!!'})
    // })

    // [실습 3] 채팅창 입장 안내 문구
    // io.emit('notice', `${socket.id} 님이 입장하셨습니다.`);

    // [실습 3-2] 채팅창 입장 문구 socket.id -> nickname
    // emit() from server
    // - socket.emit(event_name, data) : 해당 클라이언트에게만 이벤트, 데이터를 전송.
    // - io.emit(event_name, data) : 서버에 접속된 모든(all) 클라이언트 전송
    // - io.to(소켓아이디).emit(event_name, data) : 소켓아이디에 해당하는 클라이언트 에게만 전송. (귓속말)

    socket.on('setNick', (nick) => {
        console.log(`닉네임 설정 완료 :: ${nick} 님 입장`);

        // [실습 3-2-1]
        // 프론트에서 입력한 nick이 nickObjs 객체에 존재하는지 검사.
        // 이미 존재 : error 이벤트 + '이미 존재하는 닉네임 입니다'  
        // => 클라이언트 : error 이벤트 받으면 alert 띄우기.
        // 새 닉네임 : notice 이벤트 + ${nick} 님이 입장하셨습니다.
        if (Object.values(nickObjs).indexOf(nick) > - 1) {
            // 이미 존재하는 닉네임 있음.
            socket.emit('error', '이미 존재하는 닉네임 입니다.');
        } else {
            // 새로운 닉네임
            nickObjs[socket.id] = nick;
            console.log('접속 유저 목록 :: ', nickObjs);
            io.emit('notice', `${nick} 님이 입장하셨습니다.`); // 전체 공지

            // [실습 3-2-2]
            socket.emit('entrySuccess', nick); // 해당 소켓 데이터를 전송.
            updateList();
        }
    })

    // [실습 3-3] 클라이언트 퇴장시
    // "notice" 이벤트로 퇴장 공지
    socket.on('disconnect', () => {
        console.log("접속 끊김 :: ", `${nickObjs[socket.id]} 님 퇴장 ::` , socket.id);

        io.emit('notice', `${nickObjs[socket.id]} 님이 퇴장하셨습니다.`);
        delete nickObjs[socket.id]; // 닉네임 삭제
        updateList();
    })

    // [실습 4] 채팅창 메시지 전송
    // send 이벤트를 받아서
    // 모두에게 newMessage 이벤트로 {닉네임, 입력창 내용} 데이터를 전송.
    socket.on('send', (data) => {
        // { dm: '?', myNick: 'A', msg: 'B' } 형식
        // console.log("서버 측 - data :: ", data);
        // "전체 발송"
        // io.emit('newMessage', {nick : data.myNick, msg: data.msg }) -- DM 기능, IF문 시 주석.

        // [실습 5] DM 기능 추가하기
        // DM 인지 아닌지 구분해서
        // io.to(소켓아이디).emit(event_name, data) : 소켓아이디에 해당하는 클라이언트에게'만' 전송.

        if(data.dm === 'all') {
            // "전체" 발송
            io.emit('newMessage', {nick : data.myNick, msg: data.msg })
        } else {
            // "DM" 발송
            let dmSocketId = data.dm;
            const sendData = {
                nick: data.myNick,
                msg: data.msg,
                dm:'(속닥속닥)',
            }

            io.to(dmSocketId).emit('newMessage', sendData) // DM을 보내야하는 타겟(소켓아이디)한테 메세지 전송.
            socket.emit('newMessage', sendData);
            // console.log("sendData >>> ", sendData ); { nick: '파이리', msg: '안녕', dm: '(속닥속닥)' }
        } 
    })
})

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})