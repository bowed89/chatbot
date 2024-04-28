const { OpenAI } = require("openai");
const { promptFechas } = require("../utils/prompts/promptFechas");
const { promptHora } = require("../utils/prompts/promptHora");
const { promptNombre } = require("../utils/prompts/promptNombre");

require("dotenv").config();

// const { OPENAI_API_KEY } = process.env;

// open ai configuratio
/* const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}); */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const extraerHora = async (text) => {
    return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k-0613',
        messages: promptHora(text),
        temperature: 0,
        max_tokens: 100 // Limita la longitud de la respuesta generada
    });
}

const extraerNombre = async (text) => {
    return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k-0613',
        messages: promptNombre(text),
        temperature: 0,
        max_tokens: 100
    });
}

const extraerFecha = async (text) => {
    return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k-0613',
        messages: promptFechas(text),
        temperature: 0,
        max_tokens: 100
    });
}

module.exports = {
    extraerFecha,
    extraerHora,
    extraerNombre,
};