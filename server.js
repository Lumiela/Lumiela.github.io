// =========================================================
// 1. 필요한 모듈 불러오기
// =========================================================
require('dotenv').config(); // .env 파일의 환경 변수를 가져옵니다.
const express = require('express');
const cors = require('cors');
const path = require('path'); // 파일 경로 처리를 위한 모듈 추가
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// =========================================================
// 2. 초기 설정 (미들웨어 및 라이브러리 연결)
// =========================================================

app.use(express.json());
app.use(cors());

// [추가] 프론트엔드 정적 파일(HTML, CSS, JS) 서빙 설정
// 이 설정을 통해 http://localhost:3000 에 접속하면 frontend 폴더의 index.html이 보입니다.
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI API 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// =========================================================
// 3. API 라우트 작성 (텍스트 분석 요청 처리)
// =========================================================

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '텍스트가 입력되지 않았습니다.' });
  }

  try {
    console.log('AI 분석 시작:', text);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 감성 분석 AI입니다. 반드시 JSON 형식으로 응답하세요."
        },
        {
          role: "user",
          content: `다음 문장의 감정을 분석해줘.
          문장: "${text}"
          
          반드시 아래 JSON 형식으로만 대답하세요:
          {
            "sentiment": "긍정 / 부정 / 중립 중 하나",
            "confidence": 0~100 사이의 숫자,
            "reason": "분석 이유"
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content);
    console.log('AI 분석 완료:', analysisResult);

    // B. 분석 결과를 Supabase 데이터베이스에 저장
    const { error } = await supabase
      .from('sentiment_logs')
      .insert([
        {
          input_text: text,
          sentiment: analysisResult.sentiment,
          confidence: analysisResult.confidence,
          reason: analysisResult.reason
        }
      ]);

    if (error) {
      console.error('DB 저장 오류:', error);
    }

    res.json(analysisResult);

  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ error: '분석 중 서버 오류가 발생했습니다.' });
  }
});

// =========================================================
// 4. 서버 실행
// =========================================================
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
