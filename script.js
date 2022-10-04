let isDataLoaded = false;
let lastTweetLoaded = null;
let numberOfTweets = 0;
const tweetContainer = document.querySelector("#tweet-container");
const mainBody = document.querySelector("#main-body");
async function populateData() {
  const requestURL = "/data/tweets-all.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const jsonData = await response.json();
  numberOfTweets = jsonData.length;

  populateTweetData(jsonData);
}

const tweetList = [];
function populateTweetData(objs) {
  // mainBody.appendChild(article)
  let counter = 0;
  for (let obj of objs) {
    const article = document.createElement("article");
    article.className += "single-tweet";
    const text = document.createElement("div");
    text.className = "tweet-text";
    text.textContent = obj.Text;
    article.appendChild(text);
    let imgContainer = null;
    if (obj.Photos) {
      imgContainer = document.createElement("div");
      imgContainer.className = "tweet-image";
      for (let imgUrl of obj.Photos) {
        const img = document.createElement("img");
        img.src = imgUrl;
        imgContainer.appendChild(img);
      }
      article.appendChild(imgContainer);
    }
    if (obj.Videos) {
      // console.log("a video exist");
      if (imgContainer) {
        imgContainer.style.display = "none";
      }
      const videoContainer = document.createElement("div");
      videoContainer.className = "tweet-video";
      const video = document.createElement("video");
      video.src = obj.Videos[0].URL;
      video.setAttribute("height", "500");
      video.setAttribute("controls", "true");
      video.setAttribute("muted", "");
      videoContainer.appendChild(video);
      article.appendChild(videoContainer);
    }
    const timestamp = document.createElement("div");
    timestamp.className = "time";
    const unformattedTime = new Date(obj.Timestamp * 1000);
    timestamp.textContent = unformattedTime.toGMTString();
    article.appendChild(timestamp);
    if (tweetList.length > 30) {
      setTimeout(() => {
        tweetList.push(article);
      }, 100);
    }
    else{
      tweetList.push(article);
    }

    counter += 1;
    // console.log(`tweet data loaded ${Number(counter / numberOfTweets*100).toFixed(2)}%`);
  }
}

populateData();

function loadNTweet(startNumber = 0, endNumber = 20) {
  for (let count = startNumber; count <= endNumber; count++) {
    if (tweetList[count] !== (null || undefined)) {
      tweetContainer.appendChild(tweetList[count]);
      lastTweetLoaded = endNumber;
      // console.log(lastTweetLoaded, tweetList.length);
    }
  }
}

const dataLoadingCheck = setInterval(() => {
  if (tweetList.length > 0) {
    isDataLoaded = true;
    setTimeout(loadNTweet(0, 0), 1000);
    lastTweetLoaded = 0;
    clearInterval(dataLoadingCheck);
  }
}, 100);
if (isDataLoaded) {
  clearInterval(dataLoadingCheck);
}

function nextTweet() {
  const newTweet = lastTweetLoaded + 1;
  let child = tweetContainer.lastElementChild;
  while (child) {
    tweetContainer.removeChild(child);
    child = tweetContainer.lastElementChild;
  }
  loadNTweet(newTweet, newTweet);
}

const tweetChangeIntervalTime = 4000;

let changeTweetInterval = setInterval(() => {
  nextTweet();
}, tweetChangeIntervalTime);

function stopChangeTweetInterval() {
  clearInterval(changeTweetInterval);
}

// Stop the current timer when mouseover
mainBody.addEventListener("mouseover", function () {
  clearInterval(changeTweetInterval);
  // console.log("stopped changeTweetInterval");
});

// Start a new timer when mouse out
mainBody.addEventListener("mouseout", function () {
  changeTweetInterval = setInterval(() => {
    nextTweet();
  }, tweetChangeIntervalTime);
  // console.log("reinstated changeTweetInterval");
});
