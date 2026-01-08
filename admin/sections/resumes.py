import streamlit as st
import requests
import pandas as pd
from datetime import datetime
from email.utils import parsedate_to_datetime


def resumes_page(api_base: str):
    st.header("📄 Resumes")

    # ================= FETCH DATA =================
    try:
        res = requests.get(f"{api_base}/resumes", timeout=5)
        res.raise_for_status()
        payload = res.json()
    except Exception as e:
        st.error(f"Request failed: {e}")
        return

    # ================= VALIDATE RESPONSE =================
    if not payload.get("success"):
        st.error("Invalid API response format")
        st.json(payload)
        return

    resumes = payload.get("data", [])

    st.metric("Total Resumes", len(resumes))

    if not resumes:
        st.info("No resumes found")
        return

    # ================= TABLE VIEW =================
    df = pd.DataFrame(resumes)

    df.rename(columns={
        "email": "Email",
        "title": "Title",
        "created_at": "Created At"
    }, inplace=True)

    # ✅ SAFE DATE FORMAT (ISO + GMT + datetime)
    def format_date(value):
        if not value:
            return ""

        if isinstance(value, datetime):
            return value.strftime("%d %b %Y %H:%M")

        if isinstance(value, str):
            try:
                # RFC 2822 (Wed, 07 Jan 2026 12:54:27 GMT)
                if "GMT" in value:
                    return parsedate_to_datetime(value).strftime("%d %b %Y %H:%M")

                # ISO format
                return datetime.fromisoformat(value).strftime("%d %b %Y %H:%M")
            except Exception:
                return value

        return value

    if "Created At" in df.columns:
        df["Created At"] = df["Created At"].apply(format_date)

    st.subheader("📋 Resume List")
    st.dataframe(df, use_container_width=True, hide_index=True)

    # ================= DETAILS VIEW =================
    st.subheader("🔍 Resume Details")

    for r in resumes:
        email = r.get("email", "N/A")
        title = r.get("title", "Untitled")
        created_at = format_date(r.get("created_at"))

        with st.expander(f"{email} — {title}"):
            st.write(f"**Email:** {email}")
            st.write(f"**Title:** {title}")
            st.write(f"**Created At:** {created_at}")

    # ================= CSV EXPORT =================
    st.divider()

    try:
        csv_res = requests.get(f"{api_base}/resumes/export", timeout=5)
        csv_res.raise_for_status()

        st.download_button(
            "⬇️ Export Resumes CSV",
            data=csv_res.text,
            file_name="resumes.csv",
            mime="text/csv"
        )
    except Exception as e:
        st.warning(f"CSV export failed: {e}")
