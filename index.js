const { chatbotController } = require('./src/controller/chatbotController');

const app = require('./src/app');
require('dotenv').config();

// Start the server
const port = process.env.PORT || 3000;

chatbotController().catch((err) => console.log(err));

// RAILWAY
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`)
});


/* app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});

 */