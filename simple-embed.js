// CyHome Chat Widget - Simple Embed Script
(function() {
  // Default configuration
  const config = {
    apiUrl: "https://cyhome.tadajapan.com/api/v1/cyhome/invoke",
    title: "CyHome",
    logoText: "ZZ",
    autoOpen: false,
    hideButton: false,
    ...window.cyhomeConfig
  };

  // Create the chat button and widget container
  function createChatWidget() {
    // Add styles
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);

    // Create chat button
    if (!config.hideButton) {
      const button = document.createElement('button');
      button.className = 'cy-chat-button';
      button.textContent = config.logoText;
      button.onclick = toggleChat;
      document.body.appendChild(button);
    }

    // Create chat widget container
    const widget = document.createElement('div');
    widget.className = 'cy-chat-widget';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'cy-chat-iframe';
    widget.appendChild(iframe);
    document.body.appendChild(widget);

    return { widget, iframe };
  }

  // Toggle chat visibility
  function toggleChat() {
    const widget = document.querySelector('.cy-chat-widget');
    const iframe = document.querySelector('.cy-chat-iframe');
    
    if (widget.style.display === 'block') {
      widget.style.display = 'none';
    } else {
      widget.style.display = 'block';
      
      // Set iframe content if not already set
      if (!iframe.src || iframe.src === 'about:blank') {
        loadChatInterface(iframe);
      }
    }
  }

  // Load chat interface
  function loadChatInterface(iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
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
              <h3>${config.title}</h3>
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
          // Basic chat functionality
          function closeChat() {
            parent.postMessage({type: 'CLOSE_CHAT'}, '*');
          }
          
          function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            input.value = '';
            
            // Simple bot response (in a real app, this would call your API)
            setTimeout(() => {
              addMessage("Cảm ơn bạn đã liên hệ với CyHome. Đây là phiên bản demo.", 'bot');
            }, 1000);
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
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
          
          function handleKeyPress(event) {
            if (event.key === 'Enter') {
              event.preventDefault();
              sendMessage();
            }
          }
        </script>
      </body>
      </html>
    `);
    doc.close();
    
    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'CLOSE_CHAT') {
        toggleChat();
      }
    });
  }

  // Initialize when DOM is ready
  function init() {
    const { widget, iframe } = createChatWidget();
    
    // Auto open if configured
    if (config.autoOpen) {
      setTimeout(() => {
        widget.style.display = 'block';
        loadChatInterface(iframe);
      }, 1000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
