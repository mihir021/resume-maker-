import streamlit as st
from utils.api import get

def resumes_page():
    data = get("/resumes")

    st.metric("Total Resumes", data["total"])

    st.subheader("Resumes per User (encoded email)")
    st.json(data["per_user"])
