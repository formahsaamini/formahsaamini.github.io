let isDataLoaded = false;
let lastTweetLoaded = null;
const tweetContainer = document.querySelector("#tweet-container");
const mainBody = document.querySelector('#main-body')
async function populateData() {
  const requestURL = "/data/tweets-all.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const jsonData = await response.json();

  populateTweetData(jsonData);
}

const tweetList = [];
function populateTweetData(objs) {
  // mainBody.appendChild(article)
  for (let obj of objs) {
    const article = document.createElement("article");
    article.className += "single-tweet";
    const text = document.createElement("div");
    text.className = "tweet-text";
    text.textContent = obj.Text;
    article.appendChild(text);
    if (obj.Photos !== null) {
      const imgContainer = document.createElement("div");
      imgContainer.className = "tweet-image";
      for (let imgUrl of obj.Photos) {
        const img = document.createElement("img");
        img.src = imgUrl;
        imgContainer.appendChild(img);
      }
      article.appendChild(imgContainer);
    }
    if (obj.Videos !== null) {
        if(imgContainer){
            imgContainer.setAttribute('display', 'none')
        }
      const videoContainer = document.createElement("div");
      videoContainer.className = "tweet-image";

      const video = document.createElement("video");
      video.src = obj.Videos[0].URL;
      video.setAttribute("height", "500");
      videoContainer.appendChild(video);

      article.appendChild(videoContainer);
    }
    const timestamp = document.createElement("div");
    timestamp.className = "time";
    const unformattedTime = new Date(obj.Timestamp * 1000);
    timestamp.textContent = unformattedTime.toGMTString();
    article.appendChild(timestamp);
    tweetList.push(article);
  }
}

populateData();

function loadNTweet(startNumber = 0, endNumber = 20) {
  for (let count = startNumber; count <= endNumber; count++) {
    if(tweetList[count]!==null){
        tweetContainer.appendChild(tweetList[count]);
        lastTweetLoaded = endNumber
        console.log(lastTweetLoaded, tweetList.length)
    }
  }
}

const dataLoadingCheck = setInterval(() => {
  if (tweetList.length > 0) {
    isDataLoaded = true;
    setTimeout(loadNTweet(0, 0), 1000);
    lastTweetLoaded = 0
    clearInterval(dataLoadingCheck);
  }
}, 100);
if (isDataLoaded) {
  clearInterval(dataLoadingCheck);
}

function nextTweet() {
    const newTweet = lastTweetLoaded+1
  let child = tweetContainer.lastElementChild;
  while (child) {
    tweetContainer.removeChild(child);
    child = tweetContainer.lastElementChild;
  }
  loadNTweet(newTweet, newTweet)
}

const tweetChangeIntervalTime = 4000

const changeTweetInterval = setInterval(()=>{
    nextTweet()
}, tweetChangeIntervalTime)

function stopChangeTweetInterval(){
    clearInterval(changeTweetInterval)
}

// let isMouseOverTweet = false
// mainBody.addEventListener('mouseover',()=>{
//     isMouseOverTweet = true
//     stopChangeTweetInterval();
// })

// setInterval(()=>{
//     if(!isMouseOverTweet){
//         changeTweetInterval = setInterval(()=>{
//             nextTweet()
//         }, tweetChangeIntervalTime)
//     }
// }, 100)