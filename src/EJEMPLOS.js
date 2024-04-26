/******************************************************************
 SUGERENCIAS DEL FORO DE WHATSAPP-WEB.JS
 * ****************************************************************/
/*
BANNED NUMBERS
1.- Don't use the WhatsApp Business App. It always bans my numbers.
2.- Here we have the same problem, so that this doesn't 
happen to us the WhatsApp number should never be new, it must be used normally
 for 3 days from a mobile app without linking it to this library. After that, 
 it will work normally.

*/


/******************************************************************
 * EJEMPLO DE OBTENER NUMEROS CON QUIEN CHATEAMOS.
 * ****************************************************************/
app.get("/list-chats", async (req, res) => {
  try {
    const chats = await client.getChats();
    const phoneNumbers = chats.map(chat => chat.id._serialized);

    res.status(200).json({
      status: true,
      message: "List of chat phone numbers",
      phoneNumbers: phoneNumbers,
    });
  } catch (err) {
    console.error("Failed to fetch chats:", err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch chats",
      error: err.message,
    });
  }
});

// salida ===>
/*
{
  "status": true,
  "message": "List of chat phone numbers",
  "phoneNumbers": [
      "6285975255xxx@c.us",
      "6285216207xxx@c.us",
      "6289653264626@c.us"
  ]
}
*/

/******************************************************************
 * EJEMPLO DE OBTENER CHATS POR USERNASMES, HOSTORIALES, RESPONDER.
 * ****************************************************************/

app.get('/chat/messages/:username', async (req, res) => {
  if (isWhatsAppReady) {
    try {
      const { username } = req.params;

      // Find the chat by username
      const chat = await client.getChatById(username);

      // Check if the chat exists
      if (chat) {
        // Define search options to retrieve messages
        const searchOptions = {
          limit: 10, // Number of messages to retrieve (adjust as needed)
        };

        // Fetch messages from the chat
        const messages = await chat.fetchMessages(searchOptions);

        // Extract relevant message information
        const messageData = messages.map((message) => ({
          id: message.id.id,
          content: message.body,
          timestamp: message.timestamp,
          FromMe: message.id.fromMe
        }));

        res.json(messageData);
      } else {
        res.status(404).send('Chat not found');
      }
    } catch (error) {
      console.error('Error retrieving chat messages:', error);
      res.status(500).send('Error retrieving chat messages.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});


app.post('/send-message', async (req, res) => {
  const { message, DriverNumber } = req.body;
  console.log(message, DriverNumber)
  if (isWhatsAppReady) {
    try {
      await client.sendMessage(DriverNumber, message);
      res.send('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});


// Define an API endpoint for retrieving the entire chat history
app.get('/chat/history', async (req, res) => {
  try {
    // Check if WhatsApp is ready
    if (isWhatsAppReady) {
      const chats = await client.getChats();
      let chatHistory = [];

      // Define your Options for message retrieval here
      const Options = {
        limit: 10, // Number of messages to retrieve per chat (adjust as needed)
      };

      for (const chat of chats) {
        const messages = await chat.fetchMessages(Options);

        const allMessages = messages.map((message) => ({
          id: message.id.id,
          content: message.body,
          timestamp: message.timestamp,
          from: message.id.fromMe,
        }));

        chatHistory.push({
          chatId: chat.name, // Use chat.name or chat.id._serialized depending on your needs
          number: chat.id,
          isGroup: chat.isGroup,
          messages: allMessages,
        });
      }

      res.json(chatHistory);
    } else {
      res.status(400).send('WhatsApp is not yet ready.');
    }
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).send('Error retrieving chat history.');
  }
});





/******************************************************************
 * EJEMPLO DE OBTENER CHAT POR ID.
 * ****************************************************************/

client.on('ready', async () => {
  console.log('READY');

  const chats = await client.getChatById("59172016924@c.us");

  console.log(chats);

  resolve({ client, qrEmitter });
});