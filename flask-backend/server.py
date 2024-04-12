from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app,origins="*")

@app.route("/test", methods=["POST"])
def test():
    data = request.get_data(as_text=True)
    if(data=="What's 9+10?"):
        return "21"
    if(data=="My balls hurt"):
        return "You have testicular cancer. Your fucked 🗣🗣🗣 ripbozo 🚬"
    if(len(data)>=50):
        return "Bro did you have a seizure on top of your keyboard? Like seriously stfu this costs money to maintain"
    return "\""+data+"\" - 🤓"
if __name__ == "__main__":
    app.run(debug=True)