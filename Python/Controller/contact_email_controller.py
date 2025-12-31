from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

contact_api = Blueprint("contact_api", __name__, url_prefix="/api/contact")

# 📩 RECEIVER (YOUR EMAIL)
RECEIVER_EMAIL = "manushyop@gmail.com"

# 🔐 SMTP CREDENTIALS (YOUR GMAIL)
SMTP_EMAIL = os.getenv("EMAIL_USER")
SMTP_PASSWORD = os.getenv("EMAIL_PASS")


@contact_api.route("/send", methods=["POST"])
def send_contact_email():
    try:
        data = request.get_json()

        name = data.get("name")
        sender_email = data.get("email")
        subject = data.get("subject")
        message = data.get("message")

        if not all([name, sender_email, subject, message]):
            return jsonify({"success": False, "msg": "All fields required"}), 400

        # ✉️ Create email
        msg = MIMEMultipart()
        msg["From"] = SMTP_EMAIL                    # ✅ MUST be your Gmail
        msg["To"] = RECEIVER_EMAIL
        msg["Subject"] = f"[Contact] {subject}"
        msg["Reply-To"] = sender_email              # ✅ user email here

        body = f"""
New Contact Form Submission

Name: {name}
Email: {sender_email}

Message:
{message}
"""
        msg.attach(MIMEText(body, "plain"))

        # 📡 Send email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return jsonify({"success": True, "msg": "Message sent successfully"})

    except Exception as e:
        print("❌ Email Error:", e)
        return jsonify({"success": False, "msg": "Email failed"}), 500
