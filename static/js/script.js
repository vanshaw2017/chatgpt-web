// 点击发送按钮后的操作 
const chatbox = document.querySelector('.chat-wrapper');//聊天界面
const input = document.querySelector('.chat-input');//输入框
const inputDomain = document.querySelector('.chat-input-wrapper');//输入区域
const sendButton = document.querySelector('.chat-send-btn');//发送按钮


//插入新的对话，参数为对话的类型(正、反风格不一样)
function insertNewChat(classType,messageParam,reverse) {
  var messageWrapper;
  if (reverse === true){
    messageWrapper = document.querySelectorAll(classType)[0]
  }else{
    messageWrapper = document.querySelectorAll(classType)[1]
  }
  // var messageWrapper = document.querySelectorAll(classType)
  var chatItem = messageWrapper.cloneNode(true);
  var messageBox = chatItem.childNodes[1].childNodes[0];
  console.log(messageBox)
  chatItem.childNodes[3].childNodes[1].innerText= messageParam ;
  chatbox.insertBefore(chatItem,inputDomain);
}
//拼接历史文本
function makeChatRequest(){
  var userMsgList = document.querySelectorAll(".message-wrapper")//正反对话统一用这个元素来获取
  var userMsgLen = userMsgList.length
  var requestMsgList = []
  for(var i=0; i<userMsgLen; i++){
    if (i % 2 === 0){
      requestMsgList.push({ "role": "user", "content": userMsgList[i].childNodes[3].childNodes[1].innerText });
    }else{
      requestMsgList.push({ "role": "assistant", "content": userMsgList[i].childNodes[3].childNodes[1].innerText});
    } 
  }
  return requestMsgList;
}

function getChat() {
	$.ajax({
		url: "/ai_chat",
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			$("#time").html(data)
		},
		error: function(xhr, type, errorThrown) {
 
		}
	});
}
function getChat(params){
  var requestMsg = params[params.length -1]["content"]
  $.ajax(
    {
        method: 'POST',
        url: 'http://127.0.0.1:5000/ai_chat/',
        cache: false,
        data: JSON.stringify({"account":"xiaofan","message":params}),  //将data参数值转为json格式字符串
        contentType: "application/json;charset=utf-8",
        dataType:'json',
        async:true,
        success:function(result){
          if (result["code"] === 200){
            //返回结果为200
            var aiMsg = result["data"];
            //创建一个新的回复对话框
            insertNewChat(".message-wrapper",aiMsg,false) ;
            sendButton.innerText = "Send";
          }else{
            //错误提示
            //撤回上面的输入，填入对话框
            alert(result["message"])
            var tempWrapper = document.querySelectorAll(".message-wrapper.reverse")
            var lastReverse = tempWrapper[tempWrapper.length-1]
            var parent = lastReverse.parentElement;
            parent.removeChild(lastReverse);
            input.value = requestMsg
            sendButton.innerText = "Send";
          }

        }
    }
  );
  

}


// 换聊天背景的颜色
const themeColors = document.querySelectorAll('.theme-color');
themeColors.forEach(themeColor => {
  themeColor.addEventListener('click', e => {
    themeColors.forEach(c => c.classList.remove('active'));
    const theme = themeColor.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    themeColor.classList.add('active');
  });
});
//输入文本后发送聊天内容
sendButton.addEventListener('click', e => {
  // 聊天界面中展示已发送的信息
  var message = input.value;
  console.log(message);
  if (typeof message !== 'string'|| message.trim() === '') {
    return;
  }
  //在聊天框展示用户输入内容
  insertNewChat(".message-wrapper.reverse", message,true)
  input.value = '';
  // 发送按钮失效
  sendButton.disabled = true;
  sendButton.innerText = "生成中";
  //拼接历史文本
  var msgList = makeChatRequest()
  //send resuqest to back end 
  // 但是等待的时间有点长，需要考虑要不要放在一起
  getChat(msgList)
  sendButton.disabled = false;
});


