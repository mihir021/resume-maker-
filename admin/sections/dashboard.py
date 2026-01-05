import streamlit as st
from utils.api import get

def dashboard_page():
    data = get("/dashboard")

    c1, c2, c3 = st.columns(3)
    c1.metric("Total Users", data["total_users"])
    c2.metric("Total Resumes", data["total_resumes"])
    c3.metric("Feedbacks", data["total_feedbacks"])

    st.subheader("Users by Provider")
    st.bar_chart(data["providers"])
