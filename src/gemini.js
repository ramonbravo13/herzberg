export const startInterviewChat = async (organizationName = 'la empresa', headcount = 1) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Hola, estoy listo para comenzar la entrevista.",
        history: [],
        organizationName,
        headcount
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.text;
  } catch (err) {
    console.error("API Error details:", err);
    throw new Error(err.message || "Error al conectar con la IA. Verifica tu conexión.");
  }
};

export const sendMessageToBot = async (message, history = [], organizationName = 'la empresa', headcount = 1) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        organizationName,
        headcount
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.text;
  } catch (err) {
    console.error("API Error details:", err);
    throw new Error("Hubo un problema de conexión con el servidor.");
  }
};
