import React from 'react';
import './Footer.css';

const Footer = React.forwardRef((props, ref) => {
  // 임시 Link 컴포넌트
  const Link = ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>;

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-inner">
        <div className="footer-info">
          <p>(주)다온알에스 | 대표자 : 정필수 | 사업자등록번호 : 561-81-00047 | 소재지 : 광주광역시 북구 용봉로 77, 전남대 정비센터</p>
          <p>TEL : 1811-6101 | FAX : 062-525-0347 | E-mail : thankyou@daonrs.kr</p>
          <p className="eng">DAONRS Inc. | CEO : Pilsoo Jeong | Automobile center Chonnam National University, 77 Yongbong-ro, Buk-gu, Gwangju, Republic of Korea</p>
          <p>Copyright © (주)다온알에스. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
