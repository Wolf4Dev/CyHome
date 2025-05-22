// CyHome Chat Widget - Simple Embed Script
;(function () {
  // Get platformUserId from script tag data attribute
  function getPlatformUserId() {
    const scripts = document.getElementsByTagName("script")
    let platformUserId = null

    // Find the current script and check for data-platform-user-id attribute
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i]
      if (script.src && (script.src.includes("embed.js") || script.src.includes("simple-embed.js"))) {
        platformUserId = script.getAttribute("data-platform-user-id")
        break
      }
    }

    return platformUserId || generateRandomUserId()
  }

  // Generate a random user ID if not provided
  function generateRandomUserId() {
    return "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  }

  // Default configuration
  const config = {
    apiUrl: "https://cyhome.tadajapan.com/api/v1/cyhome/invoke",
    title: "CyHome",
    logoText: "RS",
    autoOpen: false,
    hideButton: false,
    platformUserId: getPlatformUserId(),
    ...window.cyhomeConfig,
  }

  // Create the chat button and widget container
  function createChatWidget() {
    // Add styles
    const style = document.createElement("style")
    style.textContent = `
      .cy-chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        border: none;
        transition: transform 0.3s;
      }
      .cy-chat-button:hover {
        transform: scale(1.05);
      }
      .cy-chat-widget {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 370px;
        height: 600px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 5px 40px rgba(0,0,0,0.2);
        z-index: 9998;
        display: none;
        border: 1px solid #e5e7eb;
      }
      .cy-chat-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      @media (max-width: 480px) {
        .cy-chat-widget {
          width: calc(100% - 40px);
          height: calc(100% - 120px);
        }
      }
    `
    document.head.appendChild(style)

    // Create chat button
    if (!config.hideButton) {
      const button = document.createElement("button")
      button.className = "cy-chat-button"
      button.textContent = config.logoText
      button.onclick = toggleChat
      document.body.appendChild(button)
    }

    // Create chat widget container
    const widget = document.createElement("div")
    widget.className = "cy-chat-widget"

    // Create iframe
    const iframe = document.createElement("iframe")
    iframe.className = "cy-chat-iframe"
    widget.appendChild(iframe)
    document.body.appendChild(widget)

    return { widget, iframe }
  }

  // Toggle chat visibility
  function toggleChat() {
    const widget = document.querySelector(".cy-chat-widget")
    const iframe = document.querySelector(".cy-chat-iframe")

    if (widget.style.display === "block") {
      widget.style.display = "none"
    } else {
      widget.style.display = "block"

      // Set iframe content if not already set
      if (!iframe.src || iframe.src === "about:blank") {
        loadChatInterface(iframe)
      }
    }
  }

  // Load chat interface
  function loadChatInterface(iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .chat-header {
            background: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo {
            width: 32px;
            height: 32px;
            background: #667eea;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
          .header-text h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
          }
          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #6b7280;
            cursor: pointer;
          }
          .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
          }
          .welcome-message {
            background: #e5e7eb;
            padding: 16px;
            border-radius: 18px;
            color: #374151;
            line-height: 1.5;
          }
          .message {
            display: flex;
            margin-bottom: 16px;
            align-items: flex-start;
          }
          .message.user {
            flex-direction: row-reverse;
          }
          .message-bubble {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            line-height: 1.4;
            font-size: 15px;
            word-wrap: break-word;
          }
          .message.bot .message-bubble {
            background: white;
            color: #374151;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 4px;
          }
          .message.user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 4px;
          }
          .chat-input {
            background: white;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
          }
          .input-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
          }
          .input-field {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 24px;
            outline: none;
            font-size: 15px;
            resize: none;
            min-height: 48px;
            max-height: 120px;
            overflow-y: auto;
          }
          .typing-indicator {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #6b7280;
            padding: 8px 16px;
            background: white;
            border-radius: 16px;
            margin-bottom: 10px;
          }
          .typing-dots {
            display: flex;
            margin-left: 8px;
          }
          .typing-dots span {
            width: 4px;
            height: 4px;
            background: #6b7280;
            border-radius: 50%;
            margin: 0 1px;
            animation: typing-dot 1.4s infinite ease-in-out;
          }
          .typing-dots span:nth-child(1) { animation-delay: 0s; }
          .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
          .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes typing-dot {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
          .send-btn {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="chat-header">
          <div class="header-content">
            <div class="logo">${config.logoText}</div>
            <div class="header-text">
              <h3 id="chat-title">${config.title}</h3>
            </div>
          </div>
          <button class="close-btn" onclick="closeChat()">&times;</button>
        </div>
        
        <div class="chat-messages" id="chatMessages">
          <div class="welcome-message">
            Xin chào! Mình là trợ lý ảo của CyHome, sẵn sàng giúp bạn mọi lúc. Hôm nay bạn cần hỗ trợ gì nào?
          </div>
        </div>
        
        <div class="chat-input">
          <div class="input-container">
            <input type="text" id="messageInput" class="input-field" placeholder="Nhập tin nhắn..." onkeypress="handleKeyPress(event)">
            <button class="send-btn" onclick="sendMessage()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
        
        <script>
          // Configuration từ parent window
          let config = {
              apiUrl: 'api/v1/cyhome/invoke',
              platformUserId: '', // Will be filled by parent window
              title: 'CyHome'
          };

          // Lắng nghe config từ parent
          window.addEventListener('message', function(event) {
              if (event.data.type === 'CONFIG') {
                  config = Object.assign({}, config, event.data.config);
                  updateUI();
              }
          });

          function updateUI() {
              if (config.title) {
                  document.getElementById('chat-title').textContent = config.title;
              }
          }

          function closeChat() {
              // Gửi message tới parent window
              if (window.parent !== window) {
                  window.parent.postMessage({
                      type: 'CLOSE_CHAT',
                      source: 'cyhome-chat-widget'
                  }, '*');
              }
          }

          function sendMessage() {
              const input = document.getElementById('messageInput');
              const message = input.value.trim();

              if (!message) return;

              // Hiển thị tin nhắn user
              addMessage(message, 'user');
              input.value = '';

              // Hiển thị typing indicator
              showTyping();

              // Xử lý tin nhắn
              processMessage(message);
          }

          function addMessage(text, sender) {
              const messagesContainer = document.getElementById('chatMessages');
              const messageDiv = document.createElement('div');
              messageDiv.className = 'message ' + sender;

              const bubbleDiv = document.createElement('div');
              bubbleDiv.className = 'message-bubble';
              bubbleDiv.textContent = text;

              messageDiv.appendChild(bubbleDiv);
              messagesContainer.appendChild(messageDiv);

              // Scroll to bottom
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }

          function showTyping() {
              const messagesContainer = document.getElementById('chatMessages');
              const typingDiv = document.createElement('div');
              typingDiv.id = 'typing-indicator';
              typingDiv.className = 'message bot';

              typingDiv.innerHTML = 
                  '<div class="typing-indicator">' +
                      'Đang trả lời' +
                      '<div class="typing-dots">' +
                          '<span></span>' +
                          '<span></span>' +
                          '<span></span>' +
                      '</div>' +
                  '</div>';

              messagesContainer.appendChild(typingDiv);
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }

          function hideTyping() {
              const typing = document.getElementById('typing-indicator');
              if (typing) {
                  typing.remove();
              }
          }

          async function processMessage(message) {
              try {
                  // Gọi API CyHome
                  const response = await callCyHomeAPI(message);

                  hideTyping();
                  addMessage(response, 'bot');

                  // Gửi event tới parent
                  if (window.parent !== window) {
                      window.parent.postMessage({
                          type: 'MESSAGE_SENT',
                          data: { userMessage: message, botResponse: response },
                          source: 'cyhome-chat-widget'
                      }, '*');
                  }
              } catch (error) {
                  hideTyping();
                  addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 'bot');
                  console.error('Error processing message:', error);
              }
          }

          async function callCyHomeAPI(message) {
              try {
                  const apiUrl = config.apiUrl.startsWith('http') ? 
                      config.apiUrl : 
                      'https://cyhome.tadajapan.com/api/v1/cyhome/invoke';

                  const response = await fetch(apiUrl, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                          message: message,
                          platform_user_id: config.platformUserId
                      })
                  });

                  if (!response.ok) {
                      throw new Error('HTTP error! status: ' + response.status);
                  }

                  const data = await response.json();

                  // Parse response theo format của API
                  if (data.status === 200 && data.data && data.data.agent_reply) {
                      return data.data.agent_reply;
                  } else if (data.message === 'Success' && data.data && data.data.agent_reply) {
                      return data.data.agent_reply;
                  } else {
                      throw new Error('Invalid API response format');
                  }
              } catch (error) {
                  console.error('API call failed:', error);
                  // Fallback response
                  return 'Xin lỗi, tôi không thể kết nối đến server. Vui lòng thử lại sau.';
              }
          }

          function generateUserId() {
              // Tạo user ID duy nhất nếu không được cung cấp
              let userId = localStorage.getItem('cyhome_user_id');
              if (!userId) {
                  userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
                  localStorage.setItem('cyhome_user_id', userId);
              }
              return userId;
          }

          function handleKeyPress(event) {
              if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
              }
          }

          function handleFileUpload() {
              // Implement file upload functionality
              alert('Tính năng upload file sẽ được cập nhật sớm!');
          }

          // Auto resize input
          const messageInput = document.getElementById('messageInput');
          messageInput.addEventListener('input', function() {
              this.style.height = 'auto';
              this.style.height = Math.min(this.scrollHeight, 120) + 'px';
          });

          // Notify parent that iframe is ready
          window.addEventListener('load', function() {
              if (window.parent !== window) {
                  window.parent.postMessage({
                      type: 'IFRAME_READY',
                      source: 'cyhome-chat-widget'
                  }, '*');
              }
          });
        
        </script>
      </body>
      </html>
    `)
    doc.close()

    // Listen for messages from iframe
    window.addEventListener("message", function (event) {
      if (event.data && event.data.type === "CLOSE_CHAT") {
        toggleChat()
      }

      if (event.data && event.data.type === "IFRAME_READY") {
        iframe.contentWindow.postMessage(
          {
            type: "CONFIG",
            config: {
              platformUserId: config.platformUserId,
              title: config.title,
              apiUrl: config.apiUrl,
            },
          },
          "*"
        )
      }
    })
  }

  // Initialize when DOM is ready
  function init() {
    const { widget, iframe } = createChatWidget()

    // Auto open if configured
    if (config.autoOpen) {
      setTimeout(() => {
        widget.style.display = "block"
        loadChatInterface(iframe)
      }, 1000)
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
