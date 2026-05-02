import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def _send(to_email: str, subject: str, html_body: str) -> None:
    EMAIL_USER = os.getenv("EMAIL_USER", "")
    EMAIL_PASS = os.getenv("EMAIL_PASS", "")
    if not EMAIL_USER or not EMAIL_PASS:
        print("[WARNING] EMAIL_USER or EMAIL_PASS not set — skipping email.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"ScholarAI Advisor <{EMAIL_USER}>"
    msg["To"]      = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
      print(f"[INFO] Sending email to {to_email}: {subject}")
      with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.ehlo()
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, to_email, msg.as_string())
        print(f"[INFO] Email sent to {to_email}: {subject}")
    except Exception as exc:
        print(f"[WARNING] Email failed: {exc}")


def send_welcome_email(to_email: str, name: str) -> None:
    subject = "Welcome to ScholarAI Advisor!"
    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Welcome to ScholarAI</title>
</head>
<body style="margin:0;padding:0;background:#060b18;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#060b18">
    <tr><td align="center" style="padding:48px 16px 32px;">

      <!-- Card -->
      <table width="580" cellpadding="0" cellspacing="0" border="0"
             style="max-width:580px;width:100%;border-radius:24px;overflow:hidden;
                    background:#0d1526;border:1px solid #1a2e4a;">

        <!-- TOP GRADIENT BANNER -->
        <tr>
          <td style="padding:0;background:linear-gradient(135deg,#0a1f3e 0%,#0e3060 40%,#0a1f3e 100%);
                     height:8px;display:block;"></td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td align="center" style="padding:40px 40px 28px;
                                     background:linear-gradient(160deg,#0d1f3c 0%,#0a1628 60%,#0d1526 100%);">
            <!-- Logo mark -->
            <div style="display:inline-block;padding:10px 24px;margin-bottom:20px;
                        background:linear-gradient(135deg,#0e3572,#1454b8);
                        border-radius:50px;border:1px solid rgba(100,160,255,0.25);">
              <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                Scholar<span style="color:#22d3ee;">AI</span>
                <span style="font-size:11px;color:rgba(255,255,255,0.5);font-weight:400;
                             letter-spacing:3px;text-transform:uppercase;margin-left:6px;">Advisor</span>
              </span>
            </div>

            <!-- Glow line -->
            <div style="width:80px;height:2px;margin:0 auto 24px;
                        background:linear-gradient(90deg,transparent,#22d3ee,#3b82f6,transparent);"></div>

            <h1 style="margin:0;font-size:30px;font-weight:800;
                       background:linear-gradient(135deg,#ffffff,#93c5fd);
                       -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                       color:#ffffff;line-height:1.2;">
              Welcome aboard,<br/>
              <span style="color:#22d3ee;-webkit-text-fill-color:#22d3ee;">{name}!</span>
            </h1>
            <p style="margin:14px 0 0;font-size:15px;color:rgba(148,163,184,0.9);line-height:1.6;max-width:400px;">
              Your AI-powered academic companion is ready. Let's unlock your full potential together.
            </p>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 40px;">
          <div style="height:1px;background:linear-gradient(90deg,transparent,#1e3a5f,#1e3a5f,transparent);"></div>
        </td></tr>

        <!-- FEATURES -->
        <tr>
          <td style="padding:32px 40px 8px;">
            <p style="margin:0 0 20px;font-size:13px;font-weight:700;color:rgba(100,160,255,0.8);
                       letter-spacing:2px;text-transform:uppercase;">
              What you can do
            </p>

            <!-- Feature rows -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:0 8px 12px 0;width:50%;vertical-align:top;">
                  <div style="background:#0a1e38;border:1px solid #1a3050;border-radius:14px;padding:16px;">
                    <div style="width:36px;height:36px;border-radius:10px;margin-bottom:10px;
                                background:linear-gradient(135deg,#0e3572,#1a5fb4);
                                display:inline-flex;align-items:center;justify-content:center;
                                text-align:center;line-height:36px;font-size:18px;">&#128200;</div>
                    <p style="margin:0;font-size:13px;font-weight:700;color:#e2e8f0;">Grade Prediction</p>
                    <p style="margin:5px 0 0;font-size:12px;color:#64748b;line-height:1.5;">
                      AI-powered forecasting using your study habits and academic data.
                    </p>
                  </div>
                </td>
                <td style="padding:0 0 12px 8px;width:50%;vertical-align:top;">
                  <div style="background:#0a1e38;border:1px solid #1a3050;border-radius:14px;padding:16px;">
                    <div style="width:36px;height:36px;border-radius:10px;margin-bottom:10px;
                                background:linear-gradient(135deg,#064e3b,#065f46);
                                display:inline-flex;align-items:center;justify-content:center;
                                text-align:center;line-height:36px;font-size:18px;">&#128188;</div>
                    <p style="margin:0;font-size:13px;font-weight:700;color:#e2e8f0;">Career Matching</p>
                    <p style="margin:5px 0 0;font-size:12px;color:#64748b;line-height:1.5;">
                      Discover career paths matched to your academic strengths.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 8px 0 0;width:50%;vertical-align:top;">
                  <div style="background:#0a1e38;border:1px solid #1a3050;border-radius:14px;padding:16px;">
                    <div style="width:36px;height:36px;border-radius:10px;margin-bottom:10px;
                                background:linear-gradient(135deg,#4c1d95,#5b21b6);
                                display:inline-flex;align-items:center;justify-content:center;
                                text-align:center;line-height:36px;font-size:18px;">&#129504;</div>
                    <p style="margin:0;font-size:13px;font-weight:700;color:#e2e8f0;">AI Advice</p>
                    <p style="margin:5px 0 0;font-size:12px;color:#64748b;line-height:1.5;">
                      Personalized study strategies from an intelligent AI agent.
                    </p>
                  </div>
                </td>
                <td style="padding:0 0 0 8px;width:50%;vertical-align:top;">
                  <div style="background:#0a1e38;border:1px solid #1a3050;border-radius:14px;padding:16px;">
                    <div style="width:36px;height:36px;border-radius:10px;margin-bottom:10px;
                                background:linear-gradient(135deg,#7c2d12,#9a3412);
                                display:inline-flex;align-items:center;justify-content:center;
                                text-align:center;line-height:36px;font-size:18px;">&#128202;</div>
                    <p style="margin:0;font-size:13px;font-weight:700;color:#e2e8f0;">Performance History</p>
                    <p style="margin:5px 0 0;font-size:12px;color:#64748b;line-height:1.5;">
                      Track your academic progress over time with detailed records.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td align="center" style="padding:36px 40px;">
            <a href="#"
               style="display:inline-block;padding:15px 48px;
                      background:linear-gradient(135deg,#0891b2,#0e7490,#2563eb);
                      color:#ffffff;text-decoration:none;
                      border-radius:14px;font-weight:700;font-size:15px;
                      letter-spacing:0.3px;
                      box-shadow:0 8px 32px rgba(6,182,212,0.35),0 2px 8px rgba(0,0,0,0.4);">
              Get Started Now
            </a>
          </td>
        </tr>

        <!-- BOTTOM GRADIENT -->
        <tr>
          <td style="padding:0;background:linear-gradient(135deg,#0a1f3e 0%,#0e3060 40%,#0a1f3e 100%);
                     height:4px;display:block;"></td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#070d1a;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#334155;font-weight:600;">
              University of South Asia &mdash; Department of Computer Science, Lahore
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:#1e293b;">
              You are receiving this email because you created a ScholarAI Advisor account.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""
    _send(to_email, subject, html_body)


def send_login_alert(to_email: str, name: str) -> None:
    now = datetime.utcnow().strftime("%d %b %Y, %H:%M UTC")
    subject = "ScholarAI: New Sign-In Detected"
    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Login Alert</title>
</head>
<body style="margin:0;padding:0;background:#060b18;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#060b18">
    <tr><td align="center" style="padding:48px 16px;">

      <table width="500" cellpadding="0" cellspacing="0" border="0"
             style="max-width:500px;width:100%;border-radius:20px;overflow:hidden;
                    background:#0d1526;border:1px solid #1a2e4a;">

        <!-- Top bar -->
        <tr><td style="background:linear-gradient(90deg,#0e3060,#1454b8,#0e3060);height:5px;"></td></tr>

        <!-- Header -->
        <tr>
          <td align="center" style="padding:32px 36px 20px;
                                     background:linear-gradient(160deg,#0d1f3c,#0a1628);">
            <div style="display:inline-block;padding:8px 20px;margin-bottom:16px;
                        background:linear-gradient(135deg,#0e3572,#1454b8);
                        border-radius:40px;border:1px solid rgba(100,160,255,0.2);">
              <span style="font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.5px;">
                Scholar<span style="color:#22d3ee;">AI</span>
              </span>
            </div>
            <p style="margin:0;font-size:11px;color:rgba(100,160,255,0.6);
                       letter-spacing:3px;text-transform:uppercase;">
              Security Alert
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 36px 32px;">
            <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#f1f5f9;">
              Hi {name},
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;">
              A successful sign-in to your ScholarAI Advisor account was recorded.
            </p>

            <!-- Info card -->
            <div style="background:#0a1e38;border:1px solid #1a3050;border-radius:14px;
                        padding:20px 24px;margin-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:12px;font-size:13px;color:#64748b;font-weight:600;
                             text-transform:uppercase;letter-spacing:1px;">
                    Sign-In Details
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#94a3b8;
                             border-top:1px solid #1e3a5f;">
                    Time
                  </td>
                  <td style="padding:8px 0;font-size:13px;color:#22d3ee;font-weight:600;
                             text-align:right;border-top:1px solid #1e3a5f;">
                    {now}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#94a3b8;
                             border-top:1px solid #1e3a5f;">
                    Account
                  </td>
                  <td style="padding:8px 0;font-size:13px;color:#e2e8f0;
                             text-align:right;border-top:1px solid #1e3a5f;">
                    {to_email}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#94a3b8;
                             border-top:1px solid #1e3a5f;">
                    Status
                  </td>
                  <td style="padding:8px 0;text-align:right;border-top:1px solid #1e3a5f;">
                    <span style="background:#052e16;color:#34d399;font-size:12px;font-weight:700;
                                 padding:3px 10px;border-radius:20px;border:1px solid #065f46;">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;
                       background:#0a1226;border:1px solid #1a2e4a;border-radius:10px;padding:14px 16px;">
              If this sign-in was not you, please change your password immediately
              and contact your administrator.
            </p>
          </td>
        </tr>

        <!-- Bottom bar -->
        <tr><td style="background:linear-gradient(90deg,#0e3060,#1454b8,#0e3060);height:3px;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#070d1a;padding:18px 36px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#1e293b;">
              University of South Asia &mdash; ScholarAI Advisor
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""
    _send(to_email, subject, html_body)
