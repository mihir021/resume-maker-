import streamlit as st
import pandas as pd
from utils.api import get

def users_page():
    users = get("/users")
    df = pd.DataFrame(users)
    st.dataframe(df, use_container_width=True)
