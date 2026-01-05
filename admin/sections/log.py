import streamlit as st

def logs_page():
    st.text_area(
        "Recent Logs",
        "[INFO] Admin logged in\n[INFO] User created resume\n[INFO] Feedback submitted",
        height=250
    )
