const addDocForm = document.querySelector("#add-doc-form");
const radioButtons = document.querySelectorAll('input[type="radio"]');
const selects = document.querySelectorAll("select");
const pdfNameInp = document.querySelector("#pdf-name");
const fileInp = document.querySelector("#file-input");
let sem;
let subject;

const loader = document.querySelector(".loader-main");
const main = document.querySelector("main");

// Event listener for radio buttons and corresponding selects
radioButtons.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const selectedRadio = e.target.value;
    sem = selectedRadio;

    const correspondingSelect = document.getElementById(`subject-${selectedRadio}`);

    if (correspondingSelect) {
      correspondingSelect.addEventListener("change", function (e) {
        subject = e.target.value;
      });
    }
  });
});

// Form submit event listener
addDocForm.addEventListener("submit", (e) => {
  e.preventDefault();
  window.scrollTo({
      top: 0,
      behavior:'smooth'
  });
  loader.classList.remove("hidden");
  main.classList.add("hidden");

  const pdfName = pdfNameInp.value.trim();
  const file = fileInp.files[0];
  const formdata = new FormData();

  formdata.append("pdf", file);
  formdata.append("subject", subject);
  formdata.append("sem", sem);
  formdata.append("title", pdfName);

    fetch('https://eduversebackend-hd6t.onrender.com/api/v1/upload', {
      method: 'POST',
      credentials: 'include',
      body: formdata
    })
    .then(response =>{
      return response.json();
    })
    .then(data => {
      loader.classList.add("hidden");
      main.classList.remove("hidden");
      
      if(data.status_code == 200) {
      showNotification(data.message, 'green')
      addDocForm.innerHTML = `
        <div class="w-[95%] md:w-fit p-5 rounded-lg bg-slate-900 shadow-tailblue shadow-lg border-2 border-tailblue">
            <h2 class="text-2xl font-semibold text-white">Do you want to add another Document? 🤔</h2>
            <button class="mt-5 px-5 py-1 rounded bg-[#38bdf8] font-bold mr-1 text-lg" id="confirm-add">Yes.!</button>
            <button class="mt-5 px-5 py-1 rounded bg-red-400 font-bold text-lg" id="home">No</button>
        </div>    
      `
      document.querySelector("#confirm-add").addEventListener('click', ()=>{window.location.replace('./addDoc.html');})
      document.querySelector("#home").addEventListener('click', ()=>{window.location.replace('./home.html');})
      }
      else {
        showNotification(data.message, 'red')
      }
    })
  
});


const showNotification = (message, color) => {
  const notification = document.querySelector("#notification");
  notification.innerHTML = `
      <div class="w-full px-4 py-2 rounded-lg text-${color}-500 font-extrabold border border-${color}-500 bg-${color}-200 drop-shadow-sm">
          <h2 class="text-xl text-center drop-shadow-2xl">${message}</h2>
      </div>`;
  notification.style.opacity = 1;
  notification.classList.add('bottom-16')

  setTimeout(() => {
      notification.classList.remove('bottom-16')
      notification.classList.add('-bottom-20')
      notification.style.opacity = 0;
  }, 3000);
};