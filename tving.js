import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

let crawl = {
  tving: async function (keyword) {
    console.log("start");
    // 가상 브라우져를 실행, headless: false를 주면 벌어지는 일을 새로운 창을 열어 보여준다(default: true)
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const ndhs_id = "anygals2"; // 추후 로그인 폼에서 아이디 비밀번호를 입력받게 할 예정
    const ndhs_pw = "qpalzm9303@";
    // const keyword = "유퀴즈"; // 이것도 나중엔 입력받아야지

    // headless: false일때 브라우져 크기 지정해주는 코드
    // await page.setViewport({
    //     width: 1366,
    //     height: 768
    // });

    //페이지로 가라
    await page.goto(
      "https://user.tving.com/pc/user/otherLogin.tving?loginType=20&from=pc&rtUrl=https%3A%2F%2Fwww.tving.com&csite=&isAuto=false"
    );

    //해당 페이지에 특정 html 태그를 클릭해라
    // await page.click(
    //   "body > div > div > div > div > div > div.row > div > div.login-body > div > div.col-xs-12.col-sm-5.login-con.pt20 > div > form > ul > li:nth-child(2)"
    // );

    //아이디랑 비밀번호 란에 값을 넣어라
    await page.evaluate(
      (id, pw) => {
        document.querySelectorAll(".in-icon-close")[0].value = id;
        document.querySelectorAll(".in-icon-close")[1].value = pw;
      },
      ndhs_id,
      ndhs_pw
    );

    //로그인 버튼을 클릭해라
    await page.click("button#doLoginBtn");

    //로그인 화면이 전환될 때까지 기다려라, headless: false 일때는 필요 반대로 headless: true일때는 없어야 되는 코드
    // >> 라고 적혀있긴 한데 true인데도 밑에꺼 주석처리하면 안된다. 로그인 실패로 뜸;;
    // await page.waitForNavigation();
    // 로딩이 길어서 타임아웃 방지용으로 상단에 있는 요소가 로드될때까지 기다린다.
    await page.waitForSelector(".menu_my");

    //로그인 성공 시(화면 전환 성공 시)
    if (page.url() === "https://www.tving.com/") {
      //학사 페이지로 가서
      await page.goto(
        `https://www.tving.com/search?keyword=${encodeURIComponent(keyword)}`,
        {
          waitUntil: "domcontentloaded",
          timeout: 0,
        }
      );
      // %EC%9C%A0%ED%80%B4%EC%A6%88&
      // 현재 페이지의 html정보를 로드
      await page.waitForSelector(".menu_my");
      const content = await page.content();
      const $ = cheerio.load(content);
      const lists = $(".item__title.false");
      const searchList = [];
      lists.each((index, list) => {
        searchList[index] = {
          name: $(list).text(),
        };
        console.log(searchList[index]);
      });
      console.log("end");

      return searchList;
    }
    //로그인 실패시
    else {
      console.log("실패");
      ndhs_id = "nope";
      ndhs_pw = "nope";
    }

    //브라우저 꺼라
    await browser.close();
  },
};

export default crawl;
