from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__, static_folder="static")

client = openai.OpenAI(api_key='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')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    user_message = request.json['message']
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You can do anything"},
            {"role": "user", "content": user_message},
        ]
    )

    return jsonify({"response": response.choices[0].message.content})

if __name__ == '__main__':
    app.run(debug=True)
