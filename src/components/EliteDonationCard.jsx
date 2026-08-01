import React from "react";

export default function EliteDonationCard() {
  return (
    <div style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif", textAlign: 'center', padding: '20px 10px', background: 'transparent', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}> 
      <style>{`
        @keyframes neonGlowElite {
          0% {
            box-shadow: 0 12px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 215, 0, 0.45), inset 0 0 15px rgba(255, 215, 0, 0.2);
            border-color: #ffd700;
          }
          50% {
            box-shadow: 0 18px 50px rgba(0,0,0,0.8), 0 0 40px rgba(255, 215, 0, 0.85), inset 0 0 25px rgba(255, 255, 255, 0.4);
            border-color: #ffffff;
          }
          100% {
            box-shadow: 0 12px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 215, 0, 0.45), inset 0 0 15px rgba(255, 215, 0, 0.2);
            border-color: #ffd700;
          }
        }

        @keyframes heartBeatElite {
          0% { transform: scale(1); }
          14% { transform: scale(1.35); }
          28% { transform: scale(1); }
          42% { transform: scale(1.35); }
          70% { transform: scale(1); }
        }

        .elite-donation-card {
          display: block;
          width: 100%;
          max-width: 980px;
          padding: 30px 20px;
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(22, 33, 53, 0.95) 100%);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 3px solid #ffd700;
          animation: neonGlowElite 3s infinite ease-in-out;
          box-sizing: border-box;
          margin: 0 auto;
          overflow: hidden;
        }

        .elite-heart {
          display: inline-block;
          animation: heartBeatElite 1.6s infinite;
          font-size: clamp(22px, 4.5vw, 30px);
          vertical-align: middle;
          filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.7));
        }

        .elite-title {
          color: #ffd700;
          font-size: clamp(16px, 4vw, 26px);
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 12px;
          text-shadow: 0 0 18px rgba(255, 215, 0, 0.75);
        }

        .elite-desc {
          font-size: clamp(13px, 3.2vw, 15px);
          color: #cbd5e1;
          font-weight: 600;
          line-height: 1.7;
          margin-bottom: 20px;
          max-width: 850px;
          margin-left: auto;
          margin-right: auto;
        }

        .elite-tag-box {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }

        .elite-tag {
          font-size: clamp(11px, 3vw, 13px);
          color: #bbf7d0;
          font-weight: 700;
          background: rgba(34, 197, 94, 0.18);
          border: 1px solid rgba(34, 197, 94, 0.5);
          padding: 6px 14px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .elite-buttons-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        @media (min-width: 768px) {
          .elite-buttons-group {
            flex-direction: row;
            justify-content: center;
          }
        }

        .elite-btn {
          width: 100%;
          max-width: 440px;
          padding: 15px 20px;
          border-radius: 50px;
          text-decoration: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 22px rgba(0,0,0,0.45);
          cursor: pointer;
          box-sizing: border-box;
        }

        .elite-zoho {
          background: linear-gradient(135deg, #e53935 0%, #b71c1c 100%);
          border: 2px solid #ff8a80;
          color: #ffffff;
        }

        .elite-zoho:hover {
          transform: translateY(-5px) scale(1.02);
          background: linear-gradient(135deg, #ff1744 0%, #c62828 100%);
          box-shadow: 0 12px 30px rgba(229, 57, 53, 0.75);
        }

        .elite-razorpay {
          background: linear-gradient(135deg, #0288d1 0%, #01579b 100%);
          border: 2px solid #81d4fa;
          color: #ffffff;
        }

        .elite-razorpay:hover {
          transform: translateY(-5px) scale(1.02);
          background: linear-gradient(135deg, #00b0ff 0%, #0277bd 100%);
          box-shadow: 0 12px 30px rgba(3, 155, 229, 0.75);
        }

        .elite-btn-title {
          font-size: clamp(16px, 4.2vw, 19px);
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: block;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .elite-btn-sub {
          font-size: clamp(11px, 3vw, 13px);
          color: #fffde7;
          display: block;
          font-weight: 600;
          margin-top: 3px;
        }

        .elite-trust-footer {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px dashed rgba(255, 215, 0, 0.4);
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #cbd5e1;
          font-weight: 700;
        }

        .elite-trust-footer span {
          color: #34d399;
        }
      `}</style>

      <div className="elite-donation-card">
        <div className="elite-title">
          <span className="elite-heart">❤️</span> Support Our Mission &amp; Donate Now ✨
        </div>

        <div className="elite-desc">
          🌱 Your small contribution creates a big social impact in Education, Health &amp; Women Empowerment. Swastik Srijan Foundation is a trusted, registered NGO in Rewa, Madhya Pradesh &amp; Pan India. Support us with an 80G tax exemption donation for rural development, child education, and community healthcare.
        </div>

        <div className="elite-tag-box">
          <div className="elite-tag">✓ 80G Tax Exemption</div>
          <div className="elite-tag">✓ 12AB Registered</div>
          <div className="elite-tag">✓ CSR-1 Compliant</div>
          <div className="elite-tag">✓ Est. 2013</div>
        </div>

        <div className="elite-buttons-group">
          <a href="https://zohosecurepay.in/checkout/yxvr3sa1-prwf19dxkza22/Donate-to-Swastik-Srijan-Foundation" target="_blank" rel="noreferrer" className="elite-btn elite-zoho">
            <span style={{fontSize: 24}}>🔒</span>
            <div style={{textAlign: 'left'}}>
              <span className="elite-btn-title">Donate via Zoho Pay</span>
              <span className="elite-btn-sub">Cards / NetBanking / UPI</span>
            </div>
          </a>

          <a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noreferrer" className="elite-btn elite-razorpay">
            <span style={{fontSize: 24}}>⚡</span>
            <div style={{textAlign: 'left'}}>
              <span className="elite-btn-title">Donate via Razorpay</span>
              <span className="elite-btn-sub">UPI / GPay / PhonePe / Paytm</span>
            </div>
          </a>
        </div>

        <div className="elite-trust-footer">
          <div>🛡️ <span>256-Bit SSL Secure</span></div>
          <div>📜 <span>Instant Tax Receipt</span></div>
          <div>🤝 <span>100% Transparent Giving</span></div>
        </div>
      </div>
    </div>
  );
}
