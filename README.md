# chatgpt-web
## 项目介绍
本项目为简易聊天机器人项目，具有多轮聊天功能。</br>
底层调用chatgpt-4.0接口，本地运行时需要vpn,也可以直接将项目部署在海外服务器上，通过IP直接访问。

## 项目结构
.
├── requirements.txt
├── static
│   ├── css
│   │   ├── normalize.min.css
│   │   └── style.css
│   ├── img
│   │   ├── 1.jpg
│   │   └── ChatGPT_logo.svg
│   └── js
│       └── script.js
├── template
│   └── index.html
└── venv
    ├── __pycache__
    │   └── flask.cpython-38.pyc
    └── app.py
## 注意    
运行时需要配置自己的openai_key,可以配置在代码里，但最好配置在环境变量里。
