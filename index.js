const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  console.log(req.body);
  // console.log(configuration.apiKey);
  console.log(configuration.getApiKey);
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const text = req.body.message || "cat";
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter text",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(text),
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

// function generatePrompt(textData) {
//   return `summarize this text.

//   ${textData}`;
// }
function generatePrompt(textData) {
  return `Rewrite this text using the principles found in How to Win Friends and Influence People. Here is the text -  
  
  ${textData}`;
}
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
