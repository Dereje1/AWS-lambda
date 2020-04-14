const desc = document.getElementById('description');
const timeSpan = document.getElementById('time');
const querySpan = document.getElementById('query');
const inputSquare = document.getElementById('inputsquare');
const name = document.getElementById('name');
const submitSquare = document.getElementById('submitsquare')

let messageMemory = {};
let connection =''

if (!location.host || location.hostname === "localhost" || location.hostname === "127.0.0.1"){
    connection = `http://localhost:3000/dev/`
} else{
    connection = `https://sgao4z9mle.execute-api.us-east-1.amazonaws.com/dev/`
}

const display = () => {
    const {description, timeStamp, query, result, ans , attempts } = messageMemory
    console.log(messageMemory)
    console.log(query*query)
    const dateObj = new Date(timeStamp)
    desc.innerHTML = description
    timeSpan.innerHTML = `${dateObj.toString()}`
    querySpan.innerHTML =`Enter the squared value of ${query}`
    if(result === undefined) return
    if(!result){
        querySpan.innerHTML =`${query} * ${query} != ${ans}, Try again! <br> ${attempts} attempts`
        querySpan.style.background = 'red'
        inputSquare.value=null
    }else{
        querySpan.innerHTML =`Lambda passed the squared value of ${query}`
        querySpan.style.background ='purple'
        inputSquare.parentNode.removeChild(inputSquare);
        name.parentNode.removeChild(name);
        submitSquare.parentNode.removeChild(submitSquare);
        const newButton = document.createElement("button")
        newButton.innerHTML ="Refresh"
        newButton.className ="submit"
        querySpan.parentNode.appendChild(newButton)
        newButton.addEventListener('click',()=>location.reload())
    }
}

const postLambda = async () => {
    if(!inputSquare.value || !name.value.trim()) return null

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...messageMemory, name: name.value.trim()})
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

const getLambda = async (user) => {
    if(!user) return
    querySpan.style.background = 'rgb(136, 136, 131)';
    try {
    const response = await fetch(`${connection}${user}`);
    const {message} = await response.json();

    messageMemory = {...message}
    setTimeout(()=>{
        display()
    },100)
    } catch (error) {
        console.log(error)
    }
}

window.addEventListener('DOMContentLoaded', async (event) => {
    //;
});

submitSquare.addEventListener('click',postLambda)

name.addEventListener('keyup',async (event)=>{
    if (event.keyCode === 13) {
        await getLambda(name.value.trim())
    }
})