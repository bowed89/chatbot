const { getEmbeddingConvertion, fineTunning } = require('./embedding');
const { getMeeting } = require('../database/database_meeting');

const mathjs = require('mathjs');

const vectorSimilarity = (x, y) => {
    const dotRes = mathjs.dot(x, y);
    const roundedNumber = parseFloat(dotRes.toFixed(2));
    return roundedNumber;
}

const removeBrackets = (text) => {
    let remove = text.replace(/(["]|[{}])+/g, '')
    return remove.split(',')
};

const randomQuestions = async (whatsappPrompt) => {
    let messageReply;

    const embeddingsHash = await getMeeting();
    const promptEmbedding = await getEmbeddingConvertion(whatsappPrompt);

    //Verificar si existe null en el atributo embedding de la BD
    if (embeddingsHash.some(obj => obj.embedding === null)) {
        console.log('si hay null en el atributo embedding');
        return;
    } else {
        // Get with dot product an array from high to low score
        const similarityScoreHash = embeddingsHash.map(({ embedding, context }) => {
            let score = vectorSimilarity(removeBrackets(promptEmbedding), removeBrackets(embedding));
            console.log("scores ==>", score);
            return result = {
                score,
                context
            }

        });
        // Get the highest score of the array similarityScoreHash
        const embeddingHighestScore = similarityScoreHash.reduce((prev, current) => {
            return (prev.score > current.score) ? prev : current
        });

        console.log("embeddingHighestScore ===> ", embeddingHighestScore);

        let finalPrompt = ''
        let completion;

        embeddingHighestScore.score < 0.79 ? (
            messageReply = 'Lo siento, no comprendi tu pregunta. Solo respondo preguntas relacionadas al restaurante MI SAZON.'
        ) : (
            // build final prompt
            finalPrompt = `
                Info: ${embeddingHighestScore.context}
                Question: ${whatsappPrompt}
                Answer:
            `,
            //Fine Tunning
            completion = await fineTunning(finalPrompt),
            messageReply = completion
        );
        console.log("completion ==> ", completion);
    }

    return messageReply;
}


module.exports = {
    randomQuestions
};