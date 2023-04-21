const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
  try {
    return await axios.get(
      "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%8C%80%EC%A0%84+%EC%97%B0%EA%B7%B9&oquery=%EB%8C%80%EC%A0%84+%EA%B3%B5%EC%97%B0&tqi=U8ozasprvxZsseDZaHlssssss1C-250912"
    );
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then((html) => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("ul.row1").children("li");
    $bodyList.each(function (i, elem) {
      ulList[i] = {
        title: $(this).find("div.list_title a").text(),
        url:
          "search.naver.com/search.naver" +
          $(this).find("div.list_title a").attr("href"),
        image_url: $(this).find("div.list_thumb a img").attr("src"),
        image_alt: $(this).find("div.list_thumb a img").attr("alt"),
      };
    });

    const data = ulList.filter((n) => n.title);
    return data;
  })
  .then((res) => {
    console.log(res);
  });
