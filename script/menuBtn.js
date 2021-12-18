var btn = document.getElementById('toggleBtn');
var closeBtn = document.getElementById('closeBtn');
var block = document.getElementById('navbar');
btn.addEventListener('click', function(){
  block.style.left = 0;
})

closeBtn.addEventListener('click', function(){
  block.style.left = '-100%';
})