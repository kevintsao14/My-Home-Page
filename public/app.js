const form = document.querySelector("form");
const messageInput = document.getElementById("message");
const responseEl = document.getElementById("response");
const messageBtn = document.getElementById("message-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log(messageInput.value);

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Create the user's message element:
  const userDiv = document.createElement("div");
  userDiv.classList.add("message", "user-message");
  // Order: content first, then the "You" label at the right.
  userDiv.innerHTML = `
    <span class="message-content">${userMessage}</span>
    <span class="message-label">You</span>
  `;
  responseEl.appendChild(userDiv);

  // Scroll the chat container to the bottom
  responseEl.scrollTop = responseEl.scrollHeight;

  messageBtn.disabled = true;
  messageBtn.innerHTML = "Sending...";

  try {
    const res = await fetch("/api/flowise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageInput.value }),
    });

    const data = await res.text();

    // Create and append the bot's message
    const botDiv = document.createElement("div");
    botDiv.classList.add("message", "bot-message");
    botDiv.innerHTML = `<strong>Agent K:</strong> ${data}`;
    responseEl.appendChild(botDiv);
    
    // Scroll the chat container to the bottom
    responseEl.scrollTop = responseEl.scrollHeight;
    } catch (error) {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("message", "bot-message");
      errorDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
      responseEl.appendChild(errorDiv);
      responseEl.scrollTop = responseEl.scrollHeight;
    } finally {
      messageBtn.disabled = false;
      messageBtn.innerHTML = "Send";
      messageInput.value = "";
    }

//     responseEl.innerHTML = data;
//   } catch (error) {
//     responseEl.innerHTML = error.message;
//   } finally {
//     messageBtn.disabled = false;
//     messageBtn.innerHTML = "Send";
//     messageInput.value = "";
//   }
});
