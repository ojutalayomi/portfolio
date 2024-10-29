const checkbox = document.querySelectorAll('#checkbox');
const stats = document.querySelectorAll('.githubstats-img img');
const a = document.querySelectorAll('a');
const maxi = document.querySelector('.maxi');
const mini = document.querySelector('.mini');

  // Create new link element
const linkElement = document.createElement('link');

// Set the attributes
linkElement.href = '/css/darkmode.css';
linkElement.rel = 'stylesheet';

checkbox.forEach((che) => {
  che.addEventListener('click', function(){
      checkbox.forEach((chec) => {
        chec.click();
      })
      if(che.checked == true){
        // stats[0].setAttribute("src", "https://github-readme-stats.vercel.app/api?username=ojutalayomi&theme=dark&hide_border=true&include_all_commits=false&count_private=false");
        // stats[1].setAttribute("src", "https://github-readme-streak-stats.herokuapp.com/?user=ojutalayomi&amp&theme=dark&hide_border=true");
        // stats[2].setAttribute("src", "https://github-readme-stats.vercel.app/api/top-langs/?username=ojutalayomi&theme=dark&hide_border=true&include_all_commits=false&count_private=false&layout=compact");
        document.body.id = "dark"
      } else if(che.checked == false) {
        // stats[0].setAttribute("src", "https://github-readme-stats.vercel.app/api?username=ojutalayomi&amp;theme=light&amp;hide_border=true&amp;include_all_commits=false&amp;count_private=false");
        // stats[1].setAttribute("src", "https://github-readme-streak-stats.herokuapp.com/?user=ojutalayomi&amp;theme=light&amp;hide_border=true");
        // stats[2].setAttribute("src", "https://github-readme-stats.vercel.app/api/top-langs/?username=ojutalayomi&amp;theme=light&amp;hide_border=true&amp;include_all_commits=false&amp;count_private=false&amp;layout=compact");
        document.body.id = ""
      }
   });   
});

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