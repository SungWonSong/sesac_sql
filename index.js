const express = require('express');
const app = express();
const PORT = 8000;
const router = require('./routes/index');
const playerrouter = require('./routes/player');
const teamRouter = require('./routes/player');
const {sequelize} = require('./models');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/', router);
app.use('/players', playerrouter);
app.use('/teams', teamRouter);''

sequelize
    // force : true; 서버 실행때 마다 테이블을 재 생성
    // force : false; 서버 실행 시 테이블이 없으면 
    .sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log('database connection succeeded!');
            console.log(`Server is running! Port number is ${PORT} ...`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

