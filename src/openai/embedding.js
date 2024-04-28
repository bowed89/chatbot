const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const { getMeeting, updateMeeting } = require('../database/database_meeting');

//const { OPENAI_API_KEY } = process.env;
const COMPLETIONS_MODEL = "text-davinci-003";
const EMBEDDING_MODEL = "text-embedding-ada-002";

// open ai configuration
/* const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}); */
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getEmbeddingConvertion = async (text) => {
    try {
        let embeddingsResponse = await openai.createEmbedding({
            model: EMBEDDING_MODEL,
            input: text,
            max_tokens: 100,
        });
        console.log("embeddingsResponse =>", embeddingsResponse.data);
        return `${embeddingsResponse.data.data[0].embedding}`;

    } catch (error) { console.log("error ", error); }
}

// Fine Tunning

const fineTunning = async (finalPrompt) => {
    const response = await openai.createCompletion({
        model: COMPLETIONS_MODEL,
        prompt: finalPrompt,
        max_tokens: 64,
    });

    return response.data.choices[0].text;
}


const trainDatabase = async () => {
    const getList = await getMeeting();

    getList.map(async (meeting) => {
        try {
            let convertion = await getEmbeddingConvertion(meeting.context)
            await updateMeeting(convertion, meeting.id);

        } catch (error) { console.log(error); }
    });
}

module.exports = {
    getEmbeddingConvertion,
    fineTunning,
    trainDatabase
}; 73599