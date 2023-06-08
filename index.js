const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.get("/", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const animal = req.body.animal || "rat";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 50, //IMPORTANT: for bigger text
    });
    console.log(completion.data.choices[0].text);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

function generatePrompt(topicName) {
  return `write an essay on ${topicName}. The essay should contain between 40 and 50 words. Please provide a complete essay within this word limit.`;
}
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
