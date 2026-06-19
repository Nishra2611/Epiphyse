import streamlit as st

# =====================================
# PAGE CONFIG
# =====================================

st.set_page_config(
    page_title="Epiphyse",
    page_icon="🦴",
    layout="wide"
)

# =====================================
# CUSTOM CSS
# =====================================

st.markdown("""
<style>

.main {
    background-color: #0E1117;
}

.title {
    text-align:center;
    font-size:50px;
    color:#00BFFF;
    font-weight:bold;
}

.subtitle{
    text-align:center;
    color:white;
    font-size:20px;
}

.card{
    background-color:#1E1E1E;
    padding:20px;
    border-radius:15px;
    border:1px solid #333;
}

.footer{
    text-align:center;
    color:gray;
}

</style>
""", unsafe_allow_html=True)

# =====================================
# SIDEBAR
# =====================================

st.sidebar.title("⚙️ Model Information")

st.sidebar.info("""
🦴 Model : ResNet50

📏 Input Size : 512 × 512

📊 Task : Bone Age Regression

🧠 Framework : PyTorch

🏥 Project : Epiphyse
""")

# =====================================
# HEADER
# =====================================

st.markdown(
'<p class="title">🦴 Epiphyse</p>',
unsafe_allow_html=True
)

st.markdown(
'<p class="subtitle">AI Powered Bone Age Estimation</p>',
unsafe_allow_html=True
)

st.divider()

# =====================================
# TABS
# =====================================

tab1, tab2, tab3 = st.tabs(
[
"🔍 Prediction",
"📈 Analytics",
"ℹ About"
]
)

# =====================================
# TAB 1
# =====================================

with tab1:

    col1, col2 = st.columns([2,1])

    with col1:

        st.subheader("📤 Upload Hand X-ray")

        uploaded_file = st.file_uploader(
            "",
            type=["png","jpg","jpeg"]
        )

        if uploaded_file is not None:

            st.image(
                uploaded_file,
                caption="Uploaded X-ray",
                use_container_width=True
            )

    with col2:

        st.subheader("🧑 Patient Information")

        gender = st.radio(
            "Gender",
            ["Male","Female"]
        )

        st.write("")

        st.button(
            "🔍 Predict Bone Age",
            use_container_width=True
        )

    st.divider()

    st.subheader("📊 Prediction Results")

    c1,c2,c3 = st.columns(3)

    with c1:
        st.metric(
            "Bone Age",
            "-- Months"
        )

    with c2:
        st.metric(
            "Approx Age",
            "-- Years"
        )

    with c3:
        st.metric(
            "Gender",
            gender
        )

    st.info(
"""
Prediction summary will appear here.

• Bone Age

• Approximate Age

• Patient Gender
"""
)

# =====================================
# TAB 2
# =====================================

with tab2:

    st.subheader("📈 Analytics")

    st.info(
"""
Future Features

✅ Training Loss Curve

✅ Validation Loss Curve

✅ Age Distribution

✅ Grad-CAM Visualization

✅ Confidence Score

✅ Error Analysis
"""
)

# =====================================
# TAB 3
# =====================================

with tab3:

    st.subheader("ℹ Project Details")

    st.markdown("""
### 🦴 Epiphyse

Deep Learning based Bone Age Estimation system.

#### Model
- ResNet50

#### Input Resolution
- 512 × 512

#### Framework
- PyTorch

#### Objective
Estimate bone age from hand X-ray images.

#### Dataset
RSNA Bone Age Dataset

#### Future Work
- Confidence estimation
- Grad-CAM
- Explainable AI
- PDF reports
""")

st.divider()

st.markdown(
'<p class="footer">Made with using Streamlit</p>',
unsafe_allow_html=True
)
