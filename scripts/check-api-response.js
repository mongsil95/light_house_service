// API 응답 확인
const fetch = require("node-fetch");

async function checkAPI() {
  try {
    const response = await fetch("http://localhost:3001/api/resources/5");
    const data = await response.json();

    console.log("API 응답:");
    console.log("Title:", data.data?.title);
    console.log("Content 앞 200자:");
    console.log(data.data?.content?.substring(0, 200));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkAPI();
