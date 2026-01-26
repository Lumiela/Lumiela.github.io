// netlify/functions/getWeather.mjs
export const handler = async (event) => {
  // ✅ 보안 포인트: 키는 오직 Netlify 서버 환경에서만 접근하며 브라우저에는 절대 내려가지 않습니다.
  const SERVICE_KEY = process.env.WEATHER_KEY; 
  const { base_date, base_time, nx, ny } = event.queryStringParameters;
  
  const END_POINT = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  const url = `${END_POINT}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // CORS 방지
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: '기상청 서버 응답 실패' }) 
    };
  }
};