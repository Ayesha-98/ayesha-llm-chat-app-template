export interface Env {
  AI: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle POST requests (chat)
    if (request.method === 'POST') {
      try {
        const { message } = await request.json() as { message: string };
        
        let aiResponse: string;
        
        // Try to use Cloudflare AI
        try {
          const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
            messages: [
              { role: "system", content: "You are Ayesha's helpful AI assistant. Be friendly, use emojis occasionally, give short answers." },
              { role: "user", content: message }
            ]
          });
          aiResponse = response.response;
        } catch (err) {
          // Fallback responses (added features)
          aiResponse = getFallbackResponse(message);
        }
        
        return new Response(JSON.stringify({ 
          response: aiResponse,
          success: true 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: "Something went wrong",
          success: false 
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Serve HTML page for GET requests
    return new Response(getHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

// ADDED FEATURES: More responses, better handling
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  // Greetings
  if (msg.includes("hello") || msg.includes("hi")) 
    return "Hello! 👋 Welcome to Ayesha's AI Chat! How can I help you today?";
  
  if (msg.includes("how are you")) 
    return "I'm doing fantastic! Thanks for asking! 😊 Ready to help you!";
  
  if (msg.includes("what is your name") || msg.includes("who are you"))
    return "I'm Ayesha's AI Assistant! 🤖 Created specially for this chat app.";
  
  // Help
  if (msg.includes("help")) 
    return "✨ I can help with:\n• Answering questions\n• Having conversations\n• Giving suggestions\n• Sharing facts\n\nJust type anything!";
  
  if (msg.includes("feature")) 
    return "🌟 Features of this LLM Chat App:\n• AI-powered responses\n• Real-time chat\n• Clear chat button\n• Typing indicator\n• Dark/Light mode coming soon!";
  
  // Small talk
  if (msg.includes("weather")) 
    return "I can't check live weather, but I hope it's beautiful wherever you are! ☀️";
  
  if (msg.includes("thank"))
    return "You're very welcome! 💖 Happy to help anytime!";
  
  if (msg.includes("love") || msg.includes("like"))
    return "That's wonderful! ❤️ I'm here to make your day better!";
  
  if (msg.includes("bye") || msg.includes("goodbye"))
    return "Goodbye! 👋 Come back anytime for a chat!";
  
  if (msg.includes("joke")) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the JavaScript developer go bankrupt? Because he lost his promises! 💸"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  if (msg.includes("fact")) {
    const facts = [
      "Cloudflare Workers run on over 300 cities worldwide! 🌍",
      "The first computer bug was an actual moth! 🦋",
      "JavaScript was created in just 10 days! 🚀"
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }
  
  // Default response
  return `Thanks for your message! "${message.substring(0, 50)}"\n\nTry asking me about:\n• Hello / Hi\n• Help\n• Joke\n• Fact\n• Features\n\nI'm here to chat! 🚀`;
}

function getHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ayesha's LLM Chat App - AI Powered</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .chat-container {
            width: 100%;
            max-width: 800px;
            height: 90vh;
            background: white;
            border-radius: 25px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.5s ease;
        }
        
        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 25px;
            text-align: center;
        }
        
        .chat-header h1 {
            font-size: 1.8em;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .chat-header p {
            opacity: 0.9;
            font-size: 0.9em;
        }
        
        .features-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 0.75em;
            margin-top: 10px;
        }
        
        .messages-area {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .message {
            animation: fadeIn 0.3s ease;
        }
        
        .message.user {
            display: flex;
            justify-content: flex-end;
        }
        
        .message.assistant {
            display: flex;
            justify-content: flex-start;
        }
        
        .message-content {
            max-width: 70%;
            padding: 12px 18px;
            border-radius: 20px;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .message.user .message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .message.assistant .message-content {
            background: white;
            color: #374151;
            border-bottom-left-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .message.system {
            justify-content: center;
        }
        
        .message.system .message-content {
            background: #e5e7eb;
            color: #6b7280;
            font-size: 0.85em;
            max-width: 85%;
        }
        
        .message-header {
            font-size: 0.75em;
            margin-bottom: 5px;
            padding-left: 5px;
        }
        
        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
        }
        
        .input-area input {
            flex: 1;
            padding: 12px 18px;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            font-size: 1em;
            outline: none;
            transition: border-color 0.3s;
        }
        
        .input-area input:focus {
            border-color: #667eea;
        }
        
        .input-area button {
            padding: 12px 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 500;
            transition: transform 0.2s;
        }
        
        .input-area button:hover:not(:disabled) {
            transform: scale(1.02);
        }
        
        .input-area button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .clear-btn {
            background: #ef4444 !important;
        }
        
        .typing {
            display: flex;
            gap: 3px;
            padding: 10px 15px;
        }
        
        .typing span {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
        }
        
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 3px;
        }
        
        @media (max-width: 768px) {
            .message-content {
                max-width: 85%;
            }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>
                <span>🤖</span> 
                Ayesha's LLM Chat App
            </h1>
            <p>Powered by Cloudflare Workers AI | Template Based with Added Features</p>
            <div class="features-badge">
                ✨ Features: AI Responses | Jokes | Facts | Clear Chat | Typing Indicator
            </div>
        </div>
        
        <div class="messages-area" id="messages">
            <div class="message assistant">
                <div class="message-content">
                    🌸 <strong>Welcome to Ayesha's LLM Chat App!</strong><br><br>
                    I'm your AI assistant. Try asking me:<br>
                    • 💬 "Hello" or "Hi"<br>
                    • 😄 "Tell me a joke"<br>
                    • 📚 "Give me a fact"<br>
                    • ❓ "Help" or "Features"<br><br>
                    <em>What would you like to chat about?</em>
                </div>
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendMessage()">
            <button id="sendBtn" onclick="sendMessage()">Send 📤</button>
            <button onclick="clearChat()" class="clear-btn">Clear 🗑️</button>
        </div>
    </div>
    
    <script>
        let isWaiting = false;
        const messagesDiv = document.getElementById('messages');
        
        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message || isWaiting) return;
            
            // Add user message
            addMessage(message, 'user');
            input.value = '';
            isWaiting = true;
            
            // Show typing indicator
            showTyping();
            
            try {
                const response = await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                });
                
                const data = await response.json();
                hideTyping();
                
                if (data.success) {
                    addMessage(data.response, 'assistant');
                } else {
                    addMessage(data.error || 'Sorry, something went wrong! 😅', 'assistant');
                }
            } catch (error) {
                hideTyping();
                addMessage('Connection error! Please check your internet. 🌐', 'assistant');
            }
            
            isWaiting = false;
        }
        
        function addMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender;
            messageDiv.innerHTML = '<div class="message-content">' + content.replace(/\\n/g, '<br>') + '</div>';
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = '<div class="message-content"><div class="typing"><span></span><span></span><span></span></div></div>';
            messagesDiv.appendChild(typingDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        function hideTyping() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) indicator.remove();
        }
        
        function clearChat() {
            messagesDiv.innerHTML = '<div class="message assistant"><div class="message-content">✨ Chat cleared! Ask me anything new! ✨</div></div>';
        }
    </script>
</body>
</html>`;
}
}
