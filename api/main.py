import numpy as np # type: ignore
from fastapi import FastAPI, File, UploadFile # type: ignore
import uvicorn # type: ignore
from io import BytesIO
from PIL import Image # type: ignore
import tensorflow as tf # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("../saved_models/1.keras")
# beta_model = tf.keras.models.load_model("../saved_models/2.keras")


CLASS_NAMES = ["Early Blight","Late Blight","Healthy"]

@app.get("/ping")
async def ping():
    return "Hello World "

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
        file: UploadFile = File()
):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)
    # confidence = np.max(predictions[0])

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class' : predicted_class,
        'confidence' : float(confidence)
    }



if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8001)