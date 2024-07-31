from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import google.generativeai as genai
from google.oauth2 import service_account
load_dotenv()
import os

credentials = service_account.Credentials.from_service_account_file("credentials.json")
scoped_credentials = credentials.with_scopes(
    ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

api_key = os.getenv("API_KEY")
print(api_key)
app = Flask(__name__)

cors = CORS(app,origins="*")

genai.configure(api_key=api_key)
model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction="""You are an emulated medical professional who is very experienced in making logical decisions and has access to the cost of drugs and what they are used for. Your instruction will give a diagnosis based on a user's symptoms given and also return the best possible drug(s) needed with a total itemized price for the drugs and dosage, based on the following JSON file: "https://data.medicaid.gov/api/1/datastore/query/a217613c-12bc-5137-8b3a-ada0e4dad1ff/0". Return a diagnosis based on the symptoms for the response, the average units per item generally sold, and the itemized price based on multiplying the price per unit found in the NADAC dataset by the avreage units per item. If the user provides an illegible or irrelevant response, only return 'invalid_response'.""")


def sendToGemini(input):
    response = model.generate_content([input],safety_settings={HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH})
    print(response.candidates)
    print(response.text)
    return response.text

# sendToGemini("aaa")


@app.route("/test", methods=["POST"])
def test():
    data = request.get_data(as_text=True)
    if(data=="What's 9+10?"):
        return "21"
    if(data=="My balls hurt"):
        return "You have testicular cancer. Your fucked 🗣🗣🗣 ripbozo 🚬"
    # if(len(data)>=50):
    #     return "Bro did you have a seizure on top of your keyboard? Like seriously stfu this costs money to maintain"
    else:
        return sendToGemini(data)
    # return "\""+data+"\" - 🤓"
if __name__ == "__main__":
    app.run(debug=True)