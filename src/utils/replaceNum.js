const { numbers } = require('./numbers');

const replaceNum = (msg) => {
    // Reemplazar los numeros con simbolos numerales
    for (let i = 0; i < msg.length; i++) {
        const match = msg[i].match(/^\d+\./);
        if (match) {
            const numero = match[0].slice(0, -1);
            msg[i] = msg[i].replace(/^\d+\./, numbers[numero] + ' ');
        }
    }
    return msg;
}

module.exports = {
    replaceNum
}