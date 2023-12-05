console.log("Hello world!");

const myName = "Ruslan Bayramov";
console.log(myName);

const yaerEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yaerEl.textContent = currentYear;

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    // e.preventDefault();
    // const href = link.getAttribute("href");

    // // Scroll back to top
    // if (href === "#") {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //   });
    // }

    // // Scroll to other links
    // if (href !== "#" && href.startsWith("#")) {
    //   const sectionEl = document.querySelector(href);
    //   sectionEl.scrollIntoView({ behavior: "smooth" });
    // }

    // Close mobile navigation
    if (link.classList.contains("main-nav-link")) {
      headerEl.classList.toggle("nav-open");
    }
  });
});

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }
    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHeroEl);

function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// Input label refresher
const Name = document.getElementById("full-name");
const mail = document.getElementById("email");
const msg = document.getElementById("message");
const btnSub = document.getElementById("btn-sub");

const allValues = [mail, msg, Name];

const allLetters = `a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z`;
const allNumbers = `1,2,3,4,5,6,7,8,9,0`;

// 1 sec and letter checker then color changer
setInterval(function () {
  allValues.forEach(function (el) {
    allLetters.split(",").forEach((letter) => {
      if (el.value.toLowerCase().startsWith(letter)) {
        el.style.backgroundColor = "#f8d8bd";
      }

      if (el.value.trim() === "") {
        el.style.backgroundColor = "#fdf2e9";
      }

      allNumbers.split(",").forEach((num) => {
        if (el.value.startsWith(num)) {
          el.style.backgroundColor = "#fdf2e9";
        }
      });
    });
  });
}, 2000);

// Refresh all inputs after clicking the sign button
btnSub.addEventListener("click", function (e) {
  e.preventDefault();
  allValues.forEach(function (el) {
    el.value = " ";
  });
});
