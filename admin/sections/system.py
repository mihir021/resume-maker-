import streamlit as st
import requests

def system_page(api_base: str):
    st.header("⚙️ System Health")

    res = requests.get(f"{api_base}/health")
    if not res.ok:
        st.error("Health check failed")
        return

    for k, v in res.json().items():
        st.success(f"{k.upper()}: {v}")
