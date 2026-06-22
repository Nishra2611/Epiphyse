from fastapi import FastAPI, UploadFile, File, Form
import tempfile
import os

from predictor import predict_bone_age

app = FastAPI()


@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    gender: int = Form(...)
):
    suffix = os.path.splitext(image.filename)[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as tmp:
        tmp.write(await image.read())
        temp_path = tmp.name

    try:
        age = predict_bone_age(temp_path, gender)
    finally:
        os.remove(temp_path)

    return {
        "bone_age_months": age
    }