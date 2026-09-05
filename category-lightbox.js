document.addEventListener('DOMContentLoaded',()=>{
  const modal=document.querySelector('.category-modal');
  const box=document.querySelector('.lightbox');
  if(!modal||!box)return;
  const image=box.querySelector('img');
  let currentShots=[];
  let currentIndex=-1;
  let activeCategory=false;
  const nav=document.createElement('div');
  nav.className='category-lightbox-nav';
  nav.innerHTML='<button type="button" class="category-prev" aria-label="Previous image">‹</button><span class="category-count"></span><button type="button" class="category-next" aria-label="Next image">›</button>';
  box.appendChild(nav);
  const prev=nav.querySelector('.category-prev'),next=nav.querySelector('.category-next'),count=nav.querySelector('.category-count');
  const style=document.createElement('style');
  style.textContent='.category-lightbox-nav{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;align-items:center;gap:18px;z-index:100002}.category-lightbox-nav button{width:46px;height:46px;border:1px solid rgba(255,255,255,.45);border-radius:50%;background:rgba(20,16,13,.45);color:#fff;font-size:32px;line-height:1;cursor:pointer}.category-lightbox-nav button:hover{background:rgba(255,255,255,.14)}.category-count{min-width:55px;text-align:center;color:rgba(255,255,255,.75);font-size:10px;letter-spacing:.14em;text-transform:uppercase}@media(max-width:800px){.category-lightbox-nav{bottom:18px;gap:12px}.category-lightbox-nav button{width:42px;height:42px;font-size:28px}.category-count{font-size:9px}}';
  document.head.appendChild(style);
  function refresh(){
    const shots=[...modal.querySelectorAll('.category-shot')];
    currentShots=shots.map(s=>{const im=s.querySelector('img');return {src:im?.src,alt:im?.alt||''}}).filter(x=>x.src);
    currentIndex=currentShots.findIndex(x=>x.src===image.src);
    activeCategory=modal.classList.contains('open')&&currentIndex>=0;
    nav.style.display=activeCategory?'flex':'none';
    if(activeCategory){count.textContent=(currentIndex+1)+' / '+currentShots.length;prev.style.visibility=currentIndex>0?'visible':'hidden';next.style.visibility=currentIndex<currentShots.length-1?'visible':'hidden'}
  }
  function show(i){
    if(!activeCategory||!currentShots[i])return;
    currentIndex=i;image.src=currentShots[i].src;image.alt=currentShots[i].alt;count.textContent=(i+1)+' / '+currentShots.length;prev.style.visibility=i>0?'visible':'hidden';next.style.visibility=i<currentShots.length-1?'visible':'hidden';
  }
  prev.onclick=e=>{e.stopPropagation();show(currentIndex-1)};
  next.onclick=e=>{e.stopPropagation();show(currentIndex+1)};
  document.addEventListener('click',e=>{
    if(e.target.closest('.category-shot'))setTimeout(refresh,0);
  });
  window.addEventListener('keydown',e=>{
    if(!activeCategory||!box.classList.contains('open'))return;
    if(e.key==='ArrowLeft')show(currentIndex-1);
    if(e.key==='ArrowRight')show(currentIndex+1);
  });
  let startX=0;
  box.addEventListener('touchstart',e=>{if(activeCategory)startX=e.changedTouches[0].clientX},{passive:true});
  box.addEventListener('touchend',e=>{if(!activeCategory)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)show(currentIndex+(dx<0?1:-1))},{passive:true});
  const observer=new MutationObserver(refresh);observer.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  refresh();
});