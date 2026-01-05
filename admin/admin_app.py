import streamlit as st
from sections.dashboard import dashboard_page
from sections.users import users_page
from sections.resumes import resumes_page
from sections.system import system_page
from sections.logs import logs_page
import requests
# ---------------- PAGE CONFIG ----------------

API_BASE = "http://127.0.0.1:5000/api/admin"

st.set_page_config(
    page_title="Resume Maker | Admin",
    page_icon="🛠️",
    layout="wide"
)

# ---------------- AUTH STATE ----------------
if "admin" not in st.session_state:
    st.session_state.admin = None


def login_screen():
    st.title("🔐 Admin Login")

    email = st.text_input("Admin Email")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        try:
            res = requests.post(
                "http://127.0.0.1:5000/api/admin/login",
                json={"email": email, "password": password},
                timeout=5
            )

            # 🔴 IMPORTANT: handle non-200 properly
            if res.status_code != 200:
                st.error(res.json().get("message", "Login failed"))
                return

            data = res.json()

            if data.get("success"):
                st.session_state.admin = data["admin"]
                st.success("Login successful")
                st.rerun()
            else:
                st.error(data.get("message", "Login failed"))

        except Exception as e:
            st.error(f"Request failed: {e}")


# ---------------- LOGIN GATE ----------------
if not st.session_state.admin:
    login_screen()
    st.stop()

# ---------------- SIDEBAR ----------------
st.sidebar.title("Admin Panel")
st.sidebar.write(f"👤 {st.session_state.admin['name']}")

if st.sidebar.button("Logout"):
    st.session_state.admin = None
    st.rerun()

menu = st.sidebar.radio(
    "Navigation",
    ["Dashboard", "Users", "Resumes", "System", "Logs"]
)

# ---------------- ROUTING ----------------
if menu == "Dashboard":
    dashboard_page()
elif menu == "Users":
    users_page()
elif menu == "Resumes":
    resumes_page()
elif menu == "System":
    system_page()
elif menu == "Logs":
    logs_page()
