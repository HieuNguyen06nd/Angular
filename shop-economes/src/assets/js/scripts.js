function copyMenu() {
    var dptCategory = document.querySelector('.dpt-cat');
    var dptPlace = document.querySelector('.departments');
    if (dptCategory && dptPlace) {
      dptPlace.innerHTML = dptCategory.innerHTML;
    }
  
    var mainNav = document.querySelector('.header-nav nav');
    var navPlace = document.querySelector('.off-canvas nav');
    if (mainNav && navPlace) {
      navPlace.innerHTML = mainNav.innerHTML;
    }
  
    var topNav = document.querySelector('.header-top .wrapper');
    var topPlace = document.querySelector('.off-canvas .thetop-nav');
    if (topNav && topPlace) {
      topPlace.innerHTML = topNav.innerHTML;
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    copyMenu();
    const menuButton = document.querySelector('.trigger');
    const closeButton = document.querySelector('.t-close');
    const siteElement = document.querySelector('.site');
  
    if (menuButton && closeButton && siteElement) {
      menuButton.addEventListener('click', function() {
        siteElement.classList.toggle('showmenu');
      });
      closeButton.addEventListener('click', function() {
        siteElement.classList.remove('showmenu');
      });
    }
  
    // Gán sự kiện cho submenu
    const submenuIcons = document.querySelectorAll('.has-child .icon-small');
  
    submenuIcons.forEach(function(icon) {
      icon.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Đã click icon-small:", this);
  
        const parent = this.closest('.has-child');
        if (parent) {
          parent.classList.toggle('expand');
        } else {
          console.log("Không tìm thấy phần tử cha .has-child cho", this);
        }
      });
    });
  });
// slider

const swiper = new Swiper('.swiper', {
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

});

const searchButton = document.querySelector('.t-search'),
    tClose = document.querySelector('.search-close'),
    showClass = document.querySelector('.site');

searchButton.addEventListener('click', function(){
    showClass.classList.toggle('showsearch')
})
tClose.addEventListener('click', function(){
    showClass.classList.remove('showsearch')
})

//show dpt menu

const dptButton = document.querySelector('.dpt-cat .dpt-trigger'),
    dptClass =document.querySelector('.site');

dptButton.addEventListener('click', function(){
        dptClass.classList.toggle('showdpt')
    })

// product image show
var productThumb = new Swiper('.small-image', {
    loop:true,
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
        481: {
            spaceBetween: 32.
        }
    }
});

var productBig = new Swiper('.big-image', {
    loop:true,
    autiHeightL: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    thumbs: {
        swiper: productThumb, 
    }
   
});
//show dpt menu



// stock product bar %

var stocks = document.querySelectorAll('.products .stock');
for(let x = 0; x <stocks.length; x++){
  let stock = stocks[x].dataset.stock,
  available = stocks[x].querySelector('.qty-available').innerHTML,
  sold = stocks[x].querySelector('.qty-sold').innerHTML,
  percent = sold*100/stock;

  stocks[x].querySelector('.available').style.width = percent + '%';

}

// show cart onclick

const divtoShow = '.mini-cart';
const divPopup = document.querySelector(divtoShow);
const divTriger = document.querySelector('.cart-trigger');

divTriger.addEventListener('click', () => {
    setTimeout(() =>{
        if(!divPopup.classList.contains('show')){
            divPopup.classList.add('show')
        }
    }, 250)
})

//auto cose by click autoside , filter
document.addEventListener('click', (e) => {
    const isClosest = e.target.closest(divtoShow);
    if(!isClosest && divPopup.classList.contains('show')){
      divPopup.classList.remove('show')
    }
})

// show modal
window.onload = function(){
  document.querySelector('.site').classList.toggle('showmodal')
}
document.querySelector('.modalclose').addEventListener('click', function(){
  document.querySelector('.site').classList.remove('showmodal')
})


