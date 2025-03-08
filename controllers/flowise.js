export const createPrediction = async (req, res) => {
    const { message } = req.body;
    console.log(message);
  
    try {
      // Call the Flowise API endpoint here..
      const flowiseData = {
        question: message,
      };

      // Call the Flowise API endpoint here..
      const response = await fetch(
        `${process.env.FLOWISE_URL}/api/v1/prediction/${process.env.FLOW_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.FLOWISE_API_KEY}`,
          },
          body: JSON.stringify(flowiseData),
        }
    );

    const data = await response.json();

    console.log(data);
    // data.text has your answer
    // For example, remove extra \n or just leave them:
    const cleanedText = data.text.trim(); 
    // Optionally, replace newlines with <br> if you want HTML line breaks:
    const finalText = cleanedText.replace(/\n/g, '<br>');

    // Send back only the text
    res.status(200).send(finalText); 
  
    // res.status(200).json({ text: data.text });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  