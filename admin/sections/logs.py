import streamlit as st
import requests

def logs_page(api_base: str):
    st.title("📜 Activity Logs")

    log_type = st.selectbox("Select log type", ["admin", "service"])

    if st.button("Refresh Logs"):
        res = requests.get(f"{api_base}/logs?type={log_type}")
        if res.ok:
            st.text_area("Recent Logs", "".join(res.json().get("logs", [])), height=350)
        else:
            st.error("Failed to load logs")
