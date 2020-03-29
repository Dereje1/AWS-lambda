const desc = document.getElementById('description');
const timeSpan = document.getElementById('time');
const querySpan = document.getElementById('query');
const inputSquare = document.getElementById('inputsquare');
const submitSquare = document.getElementById('submitsquare')

let messageMemory = {};
let connection =''

if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
    connection = `http://localhost:3000/dev/`
} else{
    connection = `https://bu3hggjpnl.execute-api.us-east-1.amazonaws.com/dev/`
}

const display = () => {
    const {description, timeStamp, query, result} = messageMemory
    console.log(query*query)
    const dateObj = new Date(timeStamp)
    desc.innerHTML = description
    timeSpan.innerHTML = `${dateObj.toString()}`
    querySpan.innerHTML =`Enter the squared value of ${query}`
    if(result === undefined) return
    if(!result){
        querySpan.innerHTML =`Lambda failed the squared value of ${query}`
        querySpan.style.background ='red'
        inputSquare.value=null
    }else{
        querySpan.innerHTML =`Lambda passed the squared value of ${query}`
        querySpan.style.background ='purple'
        inputSquare.parentNode.removeChild(inputSquare);
        submitSquare.parentNode.removeChild(submitSquare);
        const newButton = document.createElement("button")
        newButton.innerHTML ="Refresh"
        newButton.className ="submit"
        querySpan.parentNode.appendChild(newButton)
        newButton.addEventListener('click',()=>location.reload())
    }
}

const postLambda = async () => {
    if(!inputSquare.value) return null
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageMemory)
    };
    const endpoint = `${connection}${inputSquare.value}`
    try {
        
    const fetchResponse = await fetch(endpoint,settings)
    const {message} = await fetchResponse.json();
    messageMemory = { ...messageMemory, ...message}
    display()
    } catch (error) {
        console.log(error)
    }
}

const getLambda = async () => {
    try {
    const response = await fetch(connection);
    const {message} = await response.json();
    messageMemory = {...message, ...messageMemory}
    display()
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('DOMContentLoaded', async (event) => {
    await getLambda();
});

submitSquare.addEventListener('click',postLambda)