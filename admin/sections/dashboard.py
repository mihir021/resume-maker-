import streamlit as st
import requests

def dashboard_page(api_base: str):
    st.header("📊 Dashboard")

    res = requests.get(f"{api_base}/dashboard")
    if not res.ok:
        st.error("Failed to load dashboard")
        return

    data = res.json()

    c1, c2, c3 = st.columns(3)
    c1.metric("Total Users", data.get("total_users", 0))
    c2.metric("Total Resumes", data.get("total_resumes", 0))
    c3.metric("Feedbacks", data.get("total_feedbacks", 0))

    st.subheader("Users by Provider")
    st.bar_chart(data.get("providers", {}))
