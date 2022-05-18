var completions;

//Load all the saved completions from local storage and populate them on the page
window.onload = function populate() {
    // Get saved data from sessionStorage
    let data = window.localStorage.getItem('completions');
    console.log(JSON.parse(data));


    completions = JSON.parse(data);
    if (completions == null) {
        completions = [];
    }
    console.log(completions);

    
    completions.forEach(completion => {
        prependCompletion(completion)
    });
}

//Add a new completion to the responses section of the page
function prependCompletion(completion) {
    let responseDiv = document.getElementById("responses");
    
    let completionTable = document.createElement("table");
    completionTable.setAttribute("class", "completion");
    let row = document.createElement("tr");
    let promptHead = document.createElement("td");
    promptHead.innerHTML = "<strong>Prompt:</strong>"; 
    let prompt = document.createElement("td");
    prompt.innerHTML = completion.prompt;
    row.appendChild(promptHead);
    row.appendChild(prompt);

    completionTable.appendChild(row);

    row = document.createElement("tr");
    let responseHead = document.createElement("td");
    responseHead.innerHTML = "<strong>Response:</strong>"; 
    let response = document.createElement("td");
    response.innerHTML = completion.response;
    row.appendChild(responseHead);
    row.appendChild(response);
    completionTable.appendChild(row);
    
    responseDiv.prepend(completionTable)

    // let completionDiv = document.createElement("div");
    // completionDiv.setAttribute("class", "completion");
    // let prompt = document.createElement("p");
    // prompt.innerHTML = "<strong>Prompt:</strong> " + completion.prompt;
    // let response = document.createElement("p");
    // response.innerHTML ="<strong>Response:</strong> " +  completion.response;
    // completionDiv.appendChild(prompt);
    // completionDiv.appendChild(response);
    
    // responseDiv.prepend(completionDiv);
}

//Takes the submitted prompt and processes it (calls api function and populates on page)
async function processPrompt() {
    

    var prompt = document.querySelector("#prompt-input").value;

    let response = await getResponse(prompt);

    console.log(response);
    let completion = {
        prompt: prompt,
        response: response
    }
    this.completions.push(completion);
    window.localStorage.setItem("completions", JSON.stringify(completions));
    prependCompletion(completion);
}

//API call to OpenAI 
function getResponse(prompt) {
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
            // Authorization: `Bearer ${process.env.OPENAI_SECRET}`,
            Authorization: `Bearer ${"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"}`,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then((data) => { 
            console.log(data);
            return data.choices[0].text })
}

//Clears the responses section of page 
function clearResponses() {
    window.localStorage.setItem("completions", null);
    document.getElementById("responses").innerHTML = "";
    completions = [];
}
