let che = document.querySelectorAll('#checkbox');
let stats = document.querySelectorAll('img');
let a = document.querySelectorAll('a');
let maxi = document.querySelector('.maxi');
let mini = document.querySelector('.mini');

  // Create new link element
var linkElement = document.createElement('link');

// Set the attributes
linkElement.href = '/css/darkmode.css';
linkElement.rel = 'stylesheet';

// Append the link element to the head
//document.head.appendChild(linkElement);

  // Select the link element
//var linkElement1 = document.querySelector('link[href="/css/darkmode.css"]');

// Remove the link element
/**if (linkElement) {
    linkElement.parentNode.removeChild(linkElement);
}**/

che[0].addEventListener('click',function (){
  if(che[0].checked == true){
    stats[4].setAttribute("src", "https://github-readme-stats.vercel.app/api?username=ojutalayomi&theme=dark&hide_border=true&include_all_commits=false&count_private=false");
    stats[5].setAttribute("src", "https://github-readme-streak-stats.herokuapp.com/?user=ojutalayomi&theme=dark&hide_border=true");
    stats[6].setAttribute("src", "https://github-readme-stats.vercel.app/api/top-langs/?username=ojutalayomi&theme=dark&hide_border=true&include_all_commits=false&count_private=false&layout=compact");
    document.head.appendChild(linkElement);
    che[1].checked = true
  } else if(che[0].checked == false) {
    stats[4].setAttribute("src", "https://github-readme-stats.vercel.app/api?username=ojutalayomi&amp;theme=light&amp;hide_border=true&amp;include_all_commits=false&amp;count_private=false");
    stats[5].setAttribute("src", "https://github-readme-streak-stats.herokuapp.com/?user=ojutalayomi&amp;theme=light&amp;hide_border=true");
    stats[6].setAttribute("src", "https://github-readme-stats.vercel.app/api/top-langs/?username=ojutalayomi&amp;theme=light&amp;hide_border=true&amp;include_all_commits=false&amp;count_private=false&amp;layout=compact");
    document.head.removeChild(linkElement);
    che[1].checked = false;
  }
})

che[1].addEventListener('click',function (){
  if(che[1].checked == true){
    stats[4].setAttribute("src", "https://github-readme-stats.vercel.app/api?username=ojutalayomi&theme=dark&hide_border=true&include_all_commits=false&count_private=false");
    stats[5].setAttribute("src", "https://github-readme-streak-stats.herokuapp.com/?user=ojutalayomi&theme=dark&hide_border=true");
    stats[6].setAttribute("src", "https://github-readme-stats.vercel.app/api/top-langs/?username=ojutalayomi&theme=dark&hide_border=true&include_all_commits=false&count_private=false&layout=compact");
    document.head.appendChild(linkElement);
    che[0].checked = true
  } else if(che[1].checked == false) {
    stats[4].setAttribute("src", "https://github-readme-stats.vercel.app/api?username=ojutalayomi&amp;theme=light&amp;hide_border=true&amp;include_all_commits=false&amp;count_private=false");
    stats[5].setAttribute("src", "https://github-readme-streak-stats.herokuapp.com/?user=ojutalayomi&amp;theme=light&amp;hide_border=true");
    stats[6].setAttribute("src", "https://github-readme-stats.vercel.app/api/top-langs/?username=ojutalayomi&amp;theme=light&amp;hide_border=true&amp;include_all_commits=false&amp;count_private=false&amp;layout=compact");
    document.head.removeChild(linkElement);
    che[0].checked = false;
  }
})
setInterval(() => {
if(window.screen.width < 992){
  maxi.style.display = "none";
  mini.style.display ="block";
} else {
  mini.style.display ="none";
  maxi.style.display = "block";
} 
  
}, 1000);
//che.onclick = () => {

//}

// Analog Clock
var secondHand = document.querySelector(".second-hand");
var minsHand = document.querySelector(".min-hand");
var hourHand = document.querySelector(".hour-hand");
setInterval(setDate, 1000);
function setDate() { 
  var now = new Date();

  var seconds = now.getSeconds();
  var secondsDegrees = (seconds / 60) * 360 + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  var mins = now.getMinutes();
  var minsDegrees = (mins / 60) * 360 + (seconds / 60) * 6 + 90;
  minsHand.style.transform = `rotate(${minsDegrees}deg)`;

  var hour = now.getHours();
  var hourDegrees = (hour / 12) * 360 + (mins / 60) * 30 + 90;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
}
setDate();
