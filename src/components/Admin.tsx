import React, { useState, useEffect } from 'react';
import { useUserSession } from '../hooks/useUserSession';
import { useUserProfile } from '../hooks/useUserProfile';
import { useImageHandler } from '../hooks/useImageHandler';
import { supabase } from '../supabaseClient';
import NotFound from './NotFound';
import './Admin.css';

interface Application {
  id: string;
  user_id: string;
  business_license_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
  local_folder_exists?: boolean;
  profiles?: {
    store_name: string;
    role: string;
  };
}

const LicenseImage: React.FC<{ url: string; backendUrl: string }> = ({ url, backendUrl }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(`${backendUrl}/api/admin/license/${url}`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (!response.ok) throw new Error();
        const blob = await response.blob();
        if (src) URL.revokeObjectURL(src);
        setSrc(URL.createObjectURL(blob));
      } catch (e: any) {
        setError("이미지 로드 실패");
      }
    };
    fetchImage();
    return () => { if (src) URL.revokeObjectURL(src); };
  }, [url, backendUrl]);

  if (error) return <div className="preview-error">이미지 로드 실패</div>;
  if (!src) return <div className="preview-loading">로딩 중...</div>;

  return <img src={src} className="preview-img" alt="License" onClick={() => window.open(src)} />;
};

const Admin: React.FC = () => {
  const { user } = useUserSession();
  const { role, loading } = useUserProfile(user);
  const { BACKEND_URL } = useImageHandler();
  const [applications, setApplications] = useState<Application[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: string]: string }>({});

  const fetchApplications = async () => {
    setFetching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${BACKEND_URL}/api/admin/applications?all=${showAll}`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      const result = await response.json();
      if (result.success) setApplications(result.data);
      else throw new Error(result.message);
    } catch (err: any) {
      console.error('Fetch error:', err);
      alert('데이터 로드 실패: ' + err.message);
    } finally { setFetching(false); }
  };

  useEffect(() => {
    if (!loading && role === 'admin') fetchApplications();
  }, [role, loading, showAll]);

  const handleAction = async (appId: string, userId: string, action: 'approve' | 'reject') => {
    let reason = action === 'reject' ? rejectionReasons[appId]?.trim() : null;
    if (action === 'reject' && !reason) return alert('거절 사유를 입력하세요.');

    if (!window.confirm(`[${action === 'approve' ? '승인' : '거절'}] 처리하시겠습니까?`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${BACKEND_URL}/api/admin/approve-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ applicationId: appId, userId, action, reason })
      });
      const result = await response.json();
      if (result.success) {
        alert('처리되었습니다.');
        fetchApplications();
      } else throw new Error(result.message);
    } catch (err: any) {
      alert('처리 중 오류 발생: ' + err.message);
    }
  };

  if (loading) return <div className="admin-container">로딩 중...</div>;
  if (role !== 'admin') return <NotFound />;

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1> 사장님 등록 신청 관리
          <div className="filter-controls">
            <label className="toggle-switch">
              <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
              전체 내역 보기
            </label>
          </div>
        </h1>
        <div className="app-list">
          {fetching ? <p>데이터를 불러오는 중...</p> : applications.length === 0 ? <p>신청 건이 없습니다.</p> : (
            <table>
              <thead>
                <tr><th>신청일</th><th>사용자 ID</th><th>제출 서류</th><th>상태</th><th>승인/거절</th></tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td><strong>{app.profiles?.store_name || app.user_id}</strong></td>
                    <td><LicenseImage url={app.business_license_url} backendUrl={BACKEND_URL} /></td>
                    <td>
                      <span className={`status-badge status-${app.status}`}>{app.status.toUpperCase()}</span>
                      {app.rejection_reason && <span className="reason-text">사유: {app.rejection_reason}</span>}
                    </td>
                    <td>
                      {app.status === 'pending' ? (
                        <div className="reject-form-container">
                          <input type="text" className="reason-input" placeholder="거절 사유" value={rejectionReasons[app.id] || ''}
                            onChange={(e) => setRejectionReasons({ ...rejectionReasons, [app.id]: e.target.value })} />
                          <div className="btn-group">
                            <button className="btn btn-approve" onClick={() => handleAction(app.id, app.user_id, 'approve')}>승인</button>
                            <button className="btn btn-reject" onClick={() => handleAction(app.id, app.user_id, 'reject')}>거절</button>
                          </div>
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
