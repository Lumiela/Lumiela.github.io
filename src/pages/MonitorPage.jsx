import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './MonitorPage.css';

// 기상청 위경도 -> 격자 변환 함수
const convertToGrid = (lat, lng) => {
  const RE = 6371.00877; const GRID = 5.0; const SLAT1 = 30.0; const SLAT2 = 60.0;
  const OLON = 126.0; const OLAT = 38.0; const XO = 43; const YO = 136;
  const DEGRAD = Math.PI / 180.0; const re = RE / GRID; const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD; const olon = OLON * DEGRAD; const olat = OLAT * DEGRAD;
  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5); sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5); ro = (re * sf) / Math.pow(ro, sn);
  let rs = {}; let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  return rs;
};

const dummyGraphData = [
  { time: '00:00', temp: 6.13 }, { time: '04:00', temp: 5.5 },
  { time: '08:00', temp: 6.0 }, { time: '12:00', temp: 8.5 },
];

const Dashboard = () => {
  // ✅ 1. 날씨 초기값 수정
  const [weather, setWeather] = useState({ temp: '-', reh: '-', sky: '-' });
  const [address, setAddress] = useState("");
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const fetchWeather = async (nx = 59, ny = 75) => {
    // ✅ 2. 주소가 설정되지 않은 경우 API 호출 방지
    if (!address && nx === 59 && ny === 75) return;

    const SERVICE_KEY = import.meta.env.VITE_WEATHER_KEY;
    const END_POINT = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
    const now = new Date();
    let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    let hour = now.getHours();
    let minute = now.getMinutes();

    if (minute < 40) {
      if (hour === 0) {
        const yesterday = new Date(now.setDate(now.getDate() - 1));
        baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
        hour = 23;
      } else { hour -= 1; }
    }
    const baseTime = `${String(hour).padStart(2, '0')}00`;

    try {
      const res = await axios.get(END_POINT, {
        params: {
          serviceKey: SERVICE_KEY, pageNo: 1, numOfRows: 10, dataType: 'JSON',
          base_date: baseDate, base_time: baseTime, nx: nx, ny: ny
        }
      });
      if (res.data.response?.header?.resultCode === "00") {
        const items = res.data.response.body.items.item;
        const t1h = items.find(i => i.category === 'T1H')?.obsrValue;
        const reh = items.find(i => i.category === 'REH')?.obsrValue;
        const pty = items.find(i => i.category === 'PTY')?.obsrValue;
        let skyStatus = pty !== '0' ? (pty === '1' ? '비' : '눈') : (parseInt(reh) > 70 ? '흐림' : '맑음');
        setWeather({ temp: t1h || '-', reh: reh || '-', sky: skyStatus });
      }
    } catch (err) { 
        console.error("날씨 호출 실패", err); 
        setWeather({ temp: '-', reh: '-', sky: '-' });
    }
  };

  const handleAddressComplete = (data) => {
    const targetAddress = data.roadAddress || data.address;
    setAddress(targetAddress);
    setIsPostcodeOpen(false);

    const { kakao } = window;
    
    if (kakao && kakao.maps && kakao.maps.load) {
        kakao.maps.load(() => {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.addressSearch(targetAddress, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              const x = result[0].x; 
              const y = result[0].y; 
              const grid = convertToGrid(parseFloat(y), parseFloat(x));
              fetchWeather(grid.nx, grid.ny);
            } else {
              const fallbackAddr = targetAddress.split(' ').slice(0, 3).join(' ');
              geocoder.addressSearch(fallbackAddr, (res, stat) => {
                if (stat === kakao.maps.services.Status.OK) {
                  const grid = convertToGrid(parseFloat(res[0].y), parseFloat(res[0].x));
                  fetchWeather(grid.nx, grid.ny);
                } else {
                  console.error("최종 좌표 변환 실패:", stat);
                  setWeather({ temp: '-', reh: '-', sky: '-' });
                }
              });
            }
          });
        });
    }
  };

  // ✅ 3. 첫 렌더링 시 주소가 있을 때만 호출하도록 설정
  useEffect(() => { 
    if (address) {
        fetchWeather(); 
    }
  }, []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-left">
          <h1>다오니 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#93c5fd' }}>Farming Data Logger</span></h1>
          <nav className="nav-buttons">
            <button className="btn-monitor">모니터링</button>
            <button style={{ background: 'none', border: 'none', color: 'white' }}>공지사항</button>
          </nav>
        </div>
        <div style={{ fontSize: '12px' }}>관리자님 | 회원정보 변경 | 로그아웃</div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="search-box">
            <button onClick={() => setIsPostcodeOpen(!isPostcodeOpen)} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
              위치 주소 설정
            </button>
          </div>
          {isPostcodeOpen && (
            <div style={{ position: 'absolute', zIndex: 100, border: '1px solid #ccc', width: '350px', backgroundColor: 'white' }}>
              <DaumPostcode onComplete={handleAddressComplete} />
            </div>
          )}
          <div className="device-card">
            <div className="device-header">
              <span style={{ fontWeight: 'bold', color: '#1e40af' }}>★ 양액딸기</span>
              <span className="status-badge">연결</span>
            </div>
            <div className="device-grid">
              <div className="grid-item">
                <div style={{ fontSize: '10px', color: '#6b7280' }}>탄산가스1</div>
                <div style={{ fontWeight: 'bold' }}>472 ppm</div>
              </div>
              <div className="grid-item">
                <div style={{ fontSize: '10px', color: '#6b7280' }}>탄산가스2</div>
                <div style={{ fontWeight: 'bold' }}>432.67</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-card">
            <div className="weather-section">
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>📍 {address || "주소를 설정해주세요"}</h2>
                <div className="weather-info">
                  <div style={{ fontSize: '40px' }}>
                    {/* ✅ 4. 주소가 있을 때만 날씨 아이콘 표시 */}
                    {address && weather.sky !== '-' ? (
                        weather.sky === '맑음' ? '☀️' : weather.sky === '비' ? '🌧️' : '☁️'
                    ) : '-'}
                  </div>
                  <div>
                    <div style={{ color: '#6b7280' }}>
                        {/* ✅ 5. 주소 유무에 따른 텍스트 노출 분기 */}
                        {address && weather.sky !== '-' ? `${weather.sky}, 습도 ${weather.reh}%` : '날씨 정보 없음'}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      {weather.temp}{address && weather.temp !== '-' ? '°C' : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', lineHeight: '1.6' }}>
                <div style={{ color: '#6b7280' }}>최고 기온 <strong style={{ color: '#ef4444' }}>9°C</strong></div>
                <div style={{ color: '#6b7280' }}>최저 기온 <strong style={{ color: '#3b82f6' }}>4°C</strong></div>
                <div>일출 06:38 | 일몰 17:58</div>
              </div>
            </div>

            <div className="stat-table">
              <div className="tab-menu">
                <div className="tab active">실시간</div>
                <div className="tab">평균</div>
                <div className="tab">기간</div>
              </div>
              <div className="stat-grid">
                <div className="stat-item highlight">
                  <div style={{ fontSize: '12px' }}>채널1 온도</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>6.13 °C</div>
                </div>
                <div className="stat-item">
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>채널2 습도</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>91.8 %</div>
                </div>
                <div className="stat-item">
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>채널3 탄산가스1</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>472 ppm</div>
                </div>
                <div className="stat-item" style={{ borderRight: 'none' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>채널4 탄산가스2</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>432.67 ppm</div>
                </div>
              </div>
            </div>

            <div className="chart-container" style={{ height: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>2026-01-22</span>
                <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '2px' }}>데이터 다운로드</button>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyGraphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[-25, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} name="온도(°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;