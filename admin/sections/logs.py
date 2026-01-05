import streamlit as st

def logs_page():
    st.title("📜 Activity Logs")

    st.text_area(
        "Recent Logs",
        value="""
[INFO] User logged in
[INFO] Resume generated
[WARNING] Slow response detected
[INFO] Redis cache hit
        """,
        height=250
    )

    st.info("Live log streaming will be added later.")
