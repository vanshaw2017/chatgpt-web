import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai


app = Flask(__name__)
CORS(app)

base_prompt = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Who won the world series in 2020?"},
                {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."}
            ]
class ChatBot:
    """
        Official ChatGPT API
        """

    def __init__(self, api_key: str = 'yourkey',
                 model: str = "gpt-3.5-turbo", retry_times: int = 3) -> None:
        """
        Initialize Chatbot with API key (from https://platform.openai.com/account/api-keys)
        """
        # openai.api_key = os.environ.get("OPENAI_API")
        openai.api_key = api_key
        self.model = model
        self.retry_times = retry_times
    def _get_completion(self, message):
        """
        Get the completion function
        """
        # 失败重试三次
        try:
            completion = openai.ChatCompletion.create(model=self.model, messages=message)
        except Exception:
            raise TimeoutError("ChatGPT 接口请求失败，请稍后重试!")
        else:
            if completion is None \
                    or completion.get("choices") is None \
                    or len(completion["choices"]) == 0 \
                    or completion["choices"][0].get("message") is None \
                    or completion["choices"][0]['message'].get("content") is None \
                    or len(completion['choices'][0]['message']['content']) == 0:
                raise KeyError("ChatGPT 没有返回内容,请修改你的问题!")
            return completion['choices'][0]['message']['content']

@app.route('/ai_chat/', methods=['POST'])
def ai_chat():
    base_res = {}
    # 接口请求参数必须包含'account'和'message'两个参数，并且massage不能为空字符串
    if not request.json or 'account' not in request.json or\
            'message' not in request.json or request.json['message'] is None or len(request.json['message']) < 1:
        base_res["code"] = 400
        base_res["data"] = ''
        base_res["message"] = '接口调用失败，请检查参数!'
        return jsonify(base_res)

    message = request.json['message']
    # print(type(message))
    # print(message)
    chat_bot = ChatBot()
    try:
        completion = chat_bot._get_completion(base_prompt + message)
        base_res["code"] = 200
        base_res["data"] = completion
        base_res["message"] = 'ChatGPT 接口调用成功!'
    except KeyError as e:
        base_res["code"] = 416
        base_res["data"] = ''
        base_res["message"] = str(e)
    except TimeoutError as e:
        # 把错误返回给前端
        base_res["code"] = 408
        base_res["data"] = ''
        base_res["message"] = str(e)
    finally:
        return jsonify(base_res)
if __name__ == "__main__":
    app.run()