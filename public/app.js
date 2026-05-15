// =========================================================
// 1. HTML(DOM) 요소 가져오기
// =========================================================
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');

const resultModal = document.getElementById('resultModal');
const closeModalBtn = document.getElementById('closeModalBtn');

const loadingArea = document.getElementById('loadingArea');
const resultArea = document.getElementById('resultArea');

const sentimentResult = document.getElementById('sentimentResult');
const confidenceResult = document.getElementById('confidenceResult');
const reasonResult = document.getElementById('reasonResult');

// [수정] 백엔드 서버 주소를 상대 경로로 변경합니다.
// 서버가 같은 포트(3000)에서 HTML도 같이 서빙하므로 이렇게 쓰는 것이 더 안전합니다.
const API_URL = '/api/analyze';

// =========================================================
// 2. 모달창 열고 닫기 함수
// =========================================================
function openModal() {
    resultModal.classList.remove('hidden');
}

function closeModal() {
    resultModal.classList.add('hidden');
}

// =========================================================
// 3. 감성 분석 실행 로직 (백엔드 서버 연동)
// =========================================================
async function handleAnalyze() {
    const text = textInput.value.trim();

    if (!text) {
        alert("분석할 텍스트를 입력해주세요.");
        return;
    }

    // 분석 시작: 로딩 상태 표시
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '분석 중...';
    
    openModal();
    loadingArea.classList.remove('hidden');
    resultArea.classList.add('hidden');

    try {
        // 백엔드 서버에 분석 요청을 보냅니다.
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        if (!response.ok) {
            throw new Error('서버 응답에 문제가 발생했습니다.');
        }

        const data = await response.json();

        // 화면에 결과 데이터 채우기
        sentimentResult.textContent = data.sentiment;
        confidenceResult.textContent = data.confidence + '%';
        reasonResult.textContent = data.reason;

        loadingArea.classList.add('hidden');
        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error('분석 중 오류 발생:', error);
        alert("분석 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.");
        closeModal();
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '분석하기';
    }
}

// =========================================================
// 4. 이벤트 리스너 등록
// =========================================================
analyzeBtn.addEventListener('click', handleAnalyze);
closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !resultModal.classList.contains('hidden')) {
        closeModal();
    }
});

resultModal.addEventListener('click', (event) => {
    if (event.target === resultModal) {
        closeModal();
    }
});
