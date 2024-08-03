const addDocForm = document.querySelector("#add-doc-form");
const radioButtons = document.querySelectorAll('input[type="radio"]');
const selects = document.querySelectorAll("select");
const pdfNameInp = document.querySelector("#pdf-name");
const fileInp = document.querySelector("#file-input");
let sem;
let subject;

const loader = document.querySelector(".loader-main");
const main = document.querySelector("main");
const yesMessage = document.querySelector("#yes");

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
addDocForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loader.classList.remove("hidden");
  main.classList.add("hidden");

  const pdfName = pdfNameInp.value.trim();
  const file = fileInp.files[0];
  const formdata = new FormData();

  formdata.append("pdf", file);
  formdata.append("subject", subject);
  formdata.append("sem", sem);
  formdata.append("title", pdfName);

  try {
    const response = await fetch('https://kirtanmojidra.pythonanywhere.com/api/v1/upload', {
      method: 'POST',
      credentials: 'include',
      body: formdata
    });

    if (response.ok) {
      yesMessage.innerHTML = `
        <div class="w-full md:w-fit p-8 rounded-lg bg-green-300">
          <h2 class="text-2xl font-semibold">✅ ${pdfName} added Successfully</h2>
        </div>  
      `;
      addDocForm.innerHTML = `
        <div class="w-[95%] md:w-fit p-5 rounded-lg bg-slate-900 shadow-tailblue shadow-lg border-2 border-tailblue">
            <h2 class="text-2xl font-semibold text-white">Do you want to add another Document? 🤔</h2>
            <button class="mt-5 px-5 py-1 rounded bg-[#38bdf8] font-bold mr-1 text-lg" id="confirm-add">Yes.!</button>
            <button class="mt-5 px-5 py-1 rounded bg-red-400 font-bold text-lg" id="home">No</button>
        </div>    
      `
      document.querySelector("#confirm-add").addEventListener('click', ()=>{window.location.replace('./addDoc.html');})
      document.querySelector("#home").addEventListener('click', ()=>{window.location.replace('./home.html');})
    } else {
      yesMessage.innerHTML = `
        <div class="w-full md:w-fit p-8 rounded-lg bg-red-300">
          <h2 class="text-2xl font-semibold">🚫 ${response.statusText} user, Please login and try again later.</h2>
        </div>`;
    }
  } catch (error) {
    console.error('Error:', error);
    yesMessage.innerHTML = `
      <div class="w-full md:w-fit p-8 rounded-lg bg-red-300">
        <h2 class="text-2xl font-semibold">🚫 ${error.message}</h2>
      </div>`;
  } finally {
    loader.classList.add("hidden");
    main.classList.remove("hidden");
    yesMessage.style.top = "200px";
    yesMessage.style.opacity = 1;

    setTimeout(() => {
      yesMessage.style.top = "12px";
      yesMessage.style.opacity = 0;
      // location.reload();
    }, 3000);
  }
});

/* 
  
*/