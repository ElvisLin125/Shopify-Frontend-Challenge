import "./App.css";
import { useEffect, useState } from 'react';

function App() {

  // const [completions, setCompletions] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    let stored = window.localStorage.getItem("completions");
    console.log(stored);
    if (JSON.parse(stored) != null) {
      setCompletions(JSON.parse(stored));
    } else {
      setCompletions([]);
    }
    
    console.log(completions);
  }, []);

  const processPrompt = async event => {
    event.preventDefault();
    let response = await getResponse();

    let completion = {
      prompt: prompt,
      response: response
    }

    // let currCompletions = completions;
    // currCompletions.push(completion);
    setCompletions([completion, ...completions]);
    window.localStorage.setItem("completions", JSON.stringify(completions));
  }

  //API call to OpenAI 
  const getResponse = () => {
    const data = {
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    return fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        return data.choices[0].text
      })
  }

  const clearResponses = () => {
    window.localStorage.setItem("completions", null);
    setCompletions([]);
  }

  return (
    <div className="App">
      <div id="prompt-section">
        <h1>Fun with AI</h1>
        <form id="form" name="promptForm" onSubmit={processPrompt}>
          <label htmlFor="prompt"><strong>Enter Prompt</strong></label>
          <br />
          <textarea name="prompt" id="prompt-input" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          <br />
          <button type="submit" id="prompt-submit-btn">Submit</button>
        </form>
      </div>
      <br />
      <br />
      <br />
      <div id="response-section">
        <h2>Responses</h2>
        <p>Responses are saved locally! Reload to test it out!</p>
        <button onClick={clearResponses} id="clear-btn">Clear Responses</button>
        <div id="responses">
          {completions.map((completion, index) => {
            console.log(completion, index);
            return (
              <table key={index} className="completions">
                <tbody>
                  <tr>
                    <td>
                      <strong>Prompt:</strong>
                    </td>
                    <td>
                      {completion.prompt}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Response:</strong>
                    </td>
                    <td>
                      {completion.response}
                    </td>
                  </tr>
                </tbody>

              </table>

            )
          })}
        </div>

      </div>
    </div>
  );
}

export default App;
