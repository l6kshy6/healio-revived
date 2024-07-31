from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import os, time, json
from openai import OpenAI
def pretty_print(messages):
    for m in messages:
        print(f"{m.role}: {m.content[0].text.value}")
    print()
load_dotenv()
assistant_id = "asst_3i5IZpgkCPLpfxuoGFz1VPz5"
client = OpenAI(api_key=(os.getenv("API_KEY")))
app = Flask(__name__)

cors = CORS(app,origins="*")

def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )
def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run
def create_thread_and_run(user_input):
    thread = client.beta.threads.create()
    run = submit_message(assistant_id, thread, user_input)
    return thread, run
# inputstring = input("Enter symptoms: ")
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
        thread1, run1 = create_thread_and_run(data)
        run1 = wait_on_run(run1, thread1)
        res = get_response(thread1).data[1].content[0].text.value
        print(res)
        return res
        # return pretty_print(get_response(thread1))
    # return "\""+data+"\" - 🤓"
if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")


# thread1, run1 = create_thread_and_run(
#     inputstring
# )