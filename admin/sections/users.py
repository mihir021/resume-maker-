import streamlit as st
import pandas as pd
import requests

def users_page(api_base: str):
    st.subheader("👥 Users Management")

    res = requests.get(f"{api_base}/users")
    if not res.ok:
        st.error("Failed to fetch users")
        return

    df = pd.DataFrame(res.json())
    if df.empty:
        st.info("No users found")
        return

    for _, u in df.iterrows():
        email = u["email"]
        role = u.get("role", "user")
        status = u.get("status", "active")

        with st.expander(f"{email} ({role})"):
            st.write(f"**Name:** {u.get('name','')}")
            st.write(f"**Provider:** {u.get('provider')}")
            st.write(f"**Status:** `{status}`")

            col1, col2, col3 = st.columns(3)

            if col1.button("🚫 Block", key=f"block_{email}", disabled=(status == "blocked" or role == "admin")):
                requests.post(f"{api_base}/users/block", json={"email": email})
                st.rerun()

            if col2.button("✅ Unblock", key=f"unblock_{email}", disabled=(status == "active" or role == "admin")):
                requests.post(f"{api_base}/users/unblock", json={"email": email})
                st.rerun()

            if role != "admin":
                if col3.button("🗑 Delete", key=f"delete_{email}"):
                    requests.post(f"{api_base}/users/delete", json={"email": email})
                    st.rerun()

    csv = requests.get(f"{api_base}/users/export")
    if csv.ok:
        st.download_button("⬇️ Export Users CSV", csv.text, "users.csv", "text/csv")
