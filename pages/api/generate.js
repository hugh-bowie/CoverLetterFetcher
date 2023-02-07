import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const company = req.body.company || '';
  if (company.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Company Name",
      }
    });
    return;
  }
  const job = req.body.job || '';
  if (job.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Job Title",
      }
    });
    return;
  }
  const years = req.body.years || '';
  if (years.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Prior Experience Time",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(company, job, years),
      temperature: 0.6,
      top_p: 1,
      stream: false,
      max_tokens: 120,



    });
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
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(company, job, years) {

  return `Write me a professional cover letter in the first person, for a potential new job as a ${job} at this company ${company}.
  Result will be 3 or 4 sentances long. 
  Please incorporate that I have ${years} years of experience in the field as a ${job}.`;
}
