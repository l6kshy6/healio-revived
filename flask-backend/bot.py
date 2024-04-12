import os, time, json
from openai import OpenAI
def pretty_print(messages):
    for m in messages:
        print(f"{m.role}: {m.content[0].text.value}")
    print()
assistant_id = "asst_waK5VGLuZif0v7F2NV5YLB87"
client = OpenAI(api_key=("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"))
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
inputstring = input("Enter symptoms: ")
thread1, run1 = create_thread_and_run(
    inputstring
)
run1 = wait_on_run(run1, thread1)
print(pretty_print(get_response(thread1)))