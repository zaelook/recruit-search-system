import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

let crawl = {
  saramin: async function () {
    console.log("start");
    // 가상 브라우져를 실행, headless: false를 주면 벌어지는 일을 새로운 창을 열어 보여준다(default: true)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const titleList = [];
    const companyList = [];
    const skillList = [];
    const regionList = [];
    const typeList = [];
    const careerList = [];
    const eduList = [];
    const result = {
      title: "",
      company: "",
      skill: "",
      region: "",
      type: "",
      career: "",
      edu: "",
    };
    // let result = null;

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    ); // 모바일 버전으로 접속을 방지하기 위해 useragent set (headless true error 방지)
    let pageNum = 1; // 페이지 파라미터를 증가시키기 위한.
    // const ndhs_id = "anygals2"; // 추후 로그인 폼에서 아이디 비밀번호를 입력받게 할 예정
    // const ndhs_pw = "qpalzm9303@";
    // const keyword = "유퀴즈"; // 이것도 나중엔 입력받아야지

    // headless: false일때 브라우져 크기 지정해주는 코드
    // await page.setViewport({
    //     width: 1366,
    //     height: 768
    // });

    //페이지로 가라
    while (pageNum < 2) {
      await page.goto(
        `https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=${pageNum}&cat_mcls=2&search_optional_item=n&search_done=y&panel_count=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`,
        {
          waitUntil: "domcontentloaded",
          timeout: 0,
        }
      );
      let incruitList = document.querySelectorAll("div.list_item");
      //해당 페이지에 특정 html 태그를 클릭해라
      // await page.click(
      //   "body > div > div > div > div > div > div.row > div > div.login-body > div > div.col-xs-12.col-sm-5.login-con.pt20 > div > form > ul > li:nth-child(2)"
      // );

      //로그인 버튼을 클릭해라
      // await page.click("button#doLoginBtn");

      //로그인 화면이 전환될 때까지 기다려라, headless: false 일때는 필요 반대로 headless: true일때는 없어야 되는 코드
      // >> 라고 적혀있긴 한데 true인데도 밑에꺼 주석처리하면 안된다. 로그인 실패로 뜸;;
      // await page.waitForNavigation();
      // 로딩이 길어서 타임아웃 방지용으로 상단에 있는 요소가 로드될때까지 기다린다.
      // await page.waitForSelector(".menu_my");

      //로그인 성공 시(화면 전환 성공 시)
      if (
        page.url() ===
        `https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=${pageNum}&cat_mcls=2&search_optional_item=n&search_done=y&panel_count=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=1#searchTitle`
      ) {
        // 해당 페이지로 가서
        // 현재 페이지의 html정보를 로드
        // .menu_my가 로드될때까지 기다려라
        // await page.waitForSelector(".menu_my");
        const content = await page.content();
        const $ = cheerio.load(content);
        const title = $(".notification_info > .job_tit > .str_tit > span");
        const company = $(".list_item > .company_nm > a > span");
        const skill = $(".notification_info > .job_meta > .job_sector"); // TODO: 이거 span이 몇개씩 나눠져있는거 한세트로 묶어줘야함
        // const region = $(".list_item > .company_info > .word_place");
        // const type = $(".list_item > .company_info > .employment_type");
        // const career = $(".list_item > .recruit_condition > .career");
        // const edu = $(".list_item > .recruit_condition > .education");
        // console.log(result)
        title.each((index, list) => {
          titleList[index] = {
            title: $(list).text(),
          };
          console.log(titleList[index]);
        });
        company.each((index, list) => {
          companyList[index] = {
            company: $(list).text(),
          };
          console.log(companyList[index]);
        });
        skill.each((index, list) => {
          skillList[index] = {
            skill: $(list).text(),
          };
          console.log(skillList[index]);
        });
        // skill.each((index, list) => {
        //   skillList[index] = $(list).text();
        //   result.skill = skillList[index];
        // });
        // region.each((index, list) => {
        //   regionList[index] = $(list).text();
        //   result.region = regionList[index];
        // });
        // type.each((index, list) => {
        //   typeList[index] = $(list).text();
        //   result.type = typeList[index];
        // });
        // career.each((index, list) => {
        //   careerList[index] = $(list).text();
        //   result.career = careerList[index];
        // });
        // edu.each((index, list) => {
        //   eduList[index] = $(list).text();
        //   result.edu = eduList[index];
        // });
        // console.log(result);
        console.log(pageNum + "end");
        pageNum++;
      }
      //로그인 실패시
      else {
        console.log("실패");
        ndhs_id = "nope";
        ndhs_pw = "nope";
      }
    }
    //브라우저 꺼라
    await browser.close();
  },
};
crawl.saramin();
// export default crawl;
