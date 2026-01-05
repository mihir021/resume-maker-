import streamlit as st
from utils.api import get

def system_page():
    health = get("/health")
    for k, v in health.items():
        st.success(f"{k.upper()}: {v}")
