import express from 'express';
const app = express();
import ejs from 'ejs';
import { crawl } from './crawling.js';
// TODO: 파일(모듈? 함수?) import 하는거 제대로 알아보자. 자꾸 오류뜨네
import bodyParser from 'body-parser';
import fs from 'fs';
// import axios from "a
// TODO: restful api
// how to upload git heroku
// git add <filename>
// git commit -a -m "message"
// git push heroku master

// heroku logs --tail
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // app에 view engine을 설치, ejs를 템플릿으로
app.use(bodyParser.urlencoded({ extended: false })); // URL 인코딩 안함
app.use(bodyParser.json()); // json 타입으로 파싱하게 설정
app.use(express.static('/')); // views 폴더 경로는 프로젝트 폴더.(__dirname이 폴더 위치)

// req는 요청 오브젝트, res는 응답 오브젝트. req는 클라이언트에서 요청한 사항을 가지고 있는 오브젝트, res는 서버에서 클라이언트로 응답을 보낼때 쓰는 오브젝트
app.get('/', function (req, res) {
   // get 요청으로 "/"를 호출했으니 res(서버 > 클라이언트)로 index.ejs를 호출하는것이다.
   console.log('hello index page!'); // 이건 클라이언트에서 호출하면(할때마다)) 서버에 콘솔로그가 뜨는듯.

   res.render('index', {}); // render(페이지파일명(확장자x 어차피 상단 app.set 함수의 두번째 인자인 ejs 파일만 읽어낼것임.), 보낼 값(object형식))
});

app.get('/saramin', function (req, res) {
   res.writeHead(200, { 'Content-Type': 'application/json' });
   res.write(JSON.stringify(data));
   res.end();
   res.end(crawl.saramin());
});

app.listen(port, () => console.log(`시작합니당. ${port}!`));
