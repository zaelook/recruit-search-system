import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer"; // 헤드리스 방식을 위해
import fs from "fs"; // 파일을 읽고 쓰고 만들고 ??
import moment from "moment"; // 현재시간 받아오는데 필요한 모듈
import MomentTimezone from "moment-timezone"; // 현재시간 받아오는데 필요한 모듈
moment.tz.setDefault("Asia/Seoul");
const now = moment().format("YYYY-MM-DD/HH:mm:ss");
export let crawl = {
  saramin: async function () {
    console.log("사람인 데이터 수집 시작");
    // 가상 브라우져를 실행, headless: false를 주면 벌어지는 일을 새로운 창을 열어 보여준다(default: true)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    ); // 모바일 버전으로 접속을 방지하기 위해 useragent set (headless true error 방지)
    let data = {};
    let pageNum = 1; // 페이지 파라미터를 증가시키기 위한.
    // headless: false일때 브라우저 크기 지정해주는 코드
    // await page.setViewport({
    //     width: 1366,
    //     height: 768
    // });

    do {
      try {
        await page.goto(
          `https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=${pageNum}&cat_mcls=2&search_optional_item=n&search_done=y&panel_count=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`,
          {
            waitUntil: "domcontentloaded",
            timeout: 0,
          }
        );
      } catch (error) {
        console.error(error);
      }

      let recruitList = [];
      let skillList = [];
      const content = await page.content();
      const $ = cheerio.load(content);
      const $bodyList = $("div.list_item");
      $bodyList.each(function (i, el) {
        $(this)
          .find(".notification_info > .job_meta > .job_sector > span")
          .each(function (index) {
            skillList[index] = $(this).text();
          });
        recruitList[i] = {
          company: $(this).find(".list_item > .company_nm > a > span").text(),
          title: $(this)
            .find(".notification_info > .job_tit > .str_tit > span")
            .text(),
          region: $(this)
            .find(".list_item > .company_info > .work_place")
            .text(),
          type: $(this)
            .find(".list_item > .company_info > .employment_type")
            .text(),
          carrer: $(this)
            .find(".list_item > .recruit_condition > .career")
            .text(),
          edu: $(this)
            .find(".list_item > .recruit_condition > .education")
            .text(),
          skill: skillList.join(", "),
          url:
            "https://www.saramin.co.kr" +
            $(this)
              .find(".notification_info > .job_tit > .str_tit")
              .attr("href"),
        };
      });
      data = recruitList.filter((n) => n.title);
      console.log(data);

      //로그인 버튼을 클릭해라
      // await page.click("button#doLoginBtn");
      //로그인 화면이 전환될 때까지 기다려라,
      // await page.waitForNavigation();
      console.log(pageNum + " page" + " end");
      pageNum++;
    } while (data.length > 1); // data가 없으면 실행 종료(위 do문 종료)
    //브라우저 꺼라
    const resultJSON = JSON.stringify(data);
    fs.writeFile(`saramin.json`, resultJSON, function (err) {
      if (err) throw err;
      console.log("complete");
    });
    console.log("사람인 데이터 수집 종료");
    await browser.close();
  },
  jobkorea: async function () {
    console.log("잡코리아 데이터 수집 시작");
    // 가상 브라우져를 실행, headless: false를 주면 벌어지는 일을 새로운 창을 열어 보여준다(default: true)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    ); // 모바일 버전으로 접속을 방지하기 위해 useragent set (headless true error 방지)
    let data = {};
    let pageNum = 1; // 페이지 파라미터를 증가시키기 위한.
    // headless: false일때 브라우저 크기 지정해주는 코드
    // await page.setViewport({
    //     width: 1366,
    //     height: 768
    // });

    do {
      try {
        await page.goto(
          `https://www.jobkorea.co.kr/recruit/joblist?menucode=industry&industryCtgr=10007#anchorGICnt_${pageNum}`,
          {
            waitUntil: "domcontentloaded",
            timeout: 0,
          }
        );
      } catch (error) {
        console.error(error);
      }
      await page.waitForSelector("#dev-gi-list");

      let recruitList = [];
      let specList = [];
      const content = await page.content();
      const $ = cheerio.load(content);
      const $bodyList = $("#dev-gi-list tr.devloopArea");
      $bodyList.each(function (i, el) {
        $(this)
          .find("td.tplTit > div.titBx > p.etc > .cell")
          .each(function (index) {
            specList[index] = $(this).text();
          });
        recruitList[i] = {
          company: $(this).find(".tplCo > a").text(),
          title: $(this).find("td.tplTit > div.titBx > strong > a").text(),
          region: specList[2],
          type: specList[3].replace(/ |\n/g, ""),
          carrer: specList[0],
          edu: specList[1],
          skill: $(this).find("td.tplTit > div.titBx > .dsc").text(),
          url:
            "https://www.saramin.co.kr" +
            $(this).find("td.tplTit > div.titBx > strong > a").attr("href"),
        };
      });
      data = recruitList.filter((n) => n.title);
      console.log(data);

      //로그인 버튼을 클릭해라
      // await page.click("button#doLoginBtn");
      //로그인 화면이 전환될 때까지 기다려라,
      // await page.waitForNavigation();
      console.log(pageNum + " page" + " end");
      pageNum++;
    } while (data.length > 1);

    //TODO: 현재는 마지막 결과만 파일에 저장되고있음 모두 저장되도록 해야함
    const resultJSON = JSON.stringify(data);
    fs.writeFile(`jobkorea.json`, resultJSON, function (err) {
      if (err) throw err;
      console.log("complete");
    });
    console.log("잡코리아 데이터 수집 종료");
    //브라우저 꺼라
    await browser.close();
  },
};
// crawl.jobkorea();
// export default crawl;
