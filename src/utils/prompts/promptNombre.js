const promptNombre = (text) => {
    return [
        { role: "system", content: "Tu eres un asistente que reserva citas medicas." },
        { role: 'system', content: `Extrae el nombre, nombres, apellido, apellidos para la cita o reserva del siguiente texto:\n"${text}"` },
        { role: 'system', content: 'El nombre en la respuesta puede ser de origen latino, anglosajon, hispano, europeo, asiatico, boliviano, peruano' },
        { role: 'system', content: 'El apellido en la respuesta puede ser de origen latino, anglosajon, hispano, europeo, asiatico, boliviano, peruano' },
        { role: 'system', content: 'Si existen dos o mas apellidos y no existe nombre, nombres entonces retornar  "nombre: null" ' },
        { role: 'system', content: `En la respuesta retornar "apellido: null", sino existe apellido, apellidos en el siguiente texto:\n"${text}" ` },
        { role: 'system', content: `En la respuesta retornar "nombre: null", sino existe nombre, nombres en el siguiente texto:\n"${text}" ` },
        { role: 'system', content: `En la respuesta retornar "nombre: null, apellido: null", sino existe nombre,nombres, apellido, apellidos en el siguiente texto:\n"${text}" ` },
        { role: 'system', content: 'La respuesta debe estar en formato JSON con el nombre y apellido' },
    ];
}

module.exports = {
    promptNombre
}

