const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const { name } = require('ejs');
const app = express();

dotenv.config({
    path : path.resolve(__dirname, '.env'),
});

app.set('view engine', 'ejs');
app.set('views', './views');


// express-session 미들웨어
app.use(session({
    // 필수 옵션, 세션 암호화하는데 쓰는 키
    secret : process.env.COOKIE_SECRET,
    // 세션이 변경되지 않더라도 매번 덮어쓰기로 저장을 하냐 / 안하냐
    resave : false,
    // 세션을 초기값이 지정되지 않은 상태에서도 처음부터 세션을 생성할 건지
    saveUninitialized: false,

    // 세션 쿠키 설정 (세션관리할 때 클라이어트로 보내는 쿠키)
    cookie : {
        httpOnly : true, // 클라이언트에서 쿠키 확인 x
        secure : false, // http에서 사용 가능하도록 (true라면 https에서만 가능)
        maxAge : 60 * 1000, // 단위
    }
}))
// 인자로 세션에 대한 설정 객체를 넣음

app.get('/', (req,res) =>{
    res.render('session');
})

app.get('/set', (req,res) =>{
    // 세션 설정
    // req.session.키 = 값;
    req.session.name = '바나나';
    req.session.age = 10;
    res.send('세션 설정 완료!');

    
})

app.get('/name', (req,res)=>{
    // 세션 사용(조회)
    // req.session.키

    console.log('req.session >> ', req.session);
    // Session {
    //      cookie : {path : '/', _expires: null, originalMaxAge : null, httpOnly : true },   
    //      name : '바나나'
    //        age : 10
    // }


    res.send({ id: req.session.sessionID, name: req.session.name});
})

app.get('/destroy', (req,res) => {
    // 세션 삭제
    // req.session.destroy(세션 삭제시 호출할 콜백함수)

    req.session.destroy((err) => {
        if (err) {
            throw err;
        }
        
        res.redirect('/name'); // 응답 : json, end, send + redirect
    })
})


app.listen(port, () => {
    console.log(`Sever is running! The port number is ${port} ...`);
})

// express-session 모듈
// : 세션 관리
// ex. 로그인 등 세션을 구현하거나 특정 클라이언트에 대한 데이터를 저장할 때 사용
// -> 사용자 별로 req.session 객체 안에 유지 / 세션은 브라우저단마다 다르게 요청하는 클라이언트로 인식