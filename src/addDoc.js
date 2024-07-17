let addDocForm = document.querySelector("#add-doc-form");
const vid = document.querySelector("#vid");
const radioButtons = document.querySelectorAll('input[type="radio"]');
const selects = document.querySelectorAll("selects");
const pdfNameInp = document.querySelector("#pdf-name");
const fileInp = document.querySelector("#file-input");
let sem;
let subject;

const loader = document.querySelector(".loader-main");
const main = document.querySelector("main")
/* 
  {
    "data": [
        {
            "Sem": "sem5",
            "date": "Monday-01-07-24",
            "path": "755a2fc7-37a4-11ef-8c62-000000000005.pdf",
            "subject": "cc-305",
            "title": "python practical",
            "username": "devarsh_8810"
        }
    ],
    "message": "success",
    "status_code": 200
  }
*/

/*let wad = [
   {
    id: Math.floor(Math.random() * 100),
    subject: "jethalal gada",
    pdfName: "sem6 syllabus",
    providerName: "@jethalal gada",
    link: "./DOCS/BCA SEM 6 SYLLABUS-feb 2020.pdf",
  },

  {
    id: Math.floor(Math.random() * 100),
    subject: "jethalal gada",
    pdfName: "sem6 syllabus",
    providerName: "@jethalal gada",
    link: "./DOCS/BCA SEM 6 SYLLABUS-feb 2020.pdf",
  },

  {
    id: Math.floor(Math.random() * 100),
    subject: "cc-301",
    pdfName: "sem5 Syllabus",
    providerName: "@Jayantilal gada",
    link: "./DOCS/Syllabus BCA Semester 5 2019.pdf",
  }, 
];*/





radioButtons.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    sem = e.target.value;
    const correspondingSelect = document.getElementById(`subject-${selectedRadio}`);
    console.log("Corresponding select element: ", correspondingSelect);

    if (correspondingSelect) {
      correspondingSelect.addEventListener("change", function (e) {
        console.log("subject: " + e.target.value);
        subject = e.target.value;
        console.log("Updated subject: " + subject);
      });
    }
  });
});

addDocForm.addEventListener("submit", (e) => {
  loader.classList.remove("hidden");
  main.classList.add("hidden");
  e.preventDefault();
  console.log(subject)
  const pdfName = pdfNameInp.value.trim();
  const file = fileInp.files[0];
  const formdata = new FormData();

  console.log(file);
  console.log(subject);
  console.log(sem);
  console.log(pdfName);


  formdata.append("pdf", file);
  formdata.append("subject", subject);
  formdata.append("sem", sem);
  formdata.append("title", pdfName);

  console.log("subject" + subject);
  fetch('https://kirtanmojidra.pythonanywhere.com/api/v1/upload', {
    method: 'POST',
    credentials: 'include',
    body: formdata
  }).then((response) => {

    if (response) {
      loader.classList.add("hidden");
      main.classList.remove("hidden");
      if (response.status == 200) {
        console.log(response);
        document.querySelector("#yes").innerHTML = `<h2 class="text-2xl font-semibold">✅ ${pdfName} added Successfully</h2>`;
        document.querySelector("#yes").style.top = "25px";
        document.querySelector("#yes").style.opacity = 1;
        document.querySelector("#video").style.opacity = 1;
        document.querySelector("#video").style.bottom = "75px";
        vid.play();
      }
      if (response.status > 200) {
        document.querySelector("#yes").innerHTML = `<h2 class="text-2xl font-semibold">Error While sending file please check sem and subject</h2>`;
        document.querySelector("#yes").style.top = "25px";
        document.querySelector("#yes").style.opacity = 1;
      }
    }
  }
  )

  setTimeout(function () {
    document.querySelector("#yes").style.top = "12px";
    document.querySelector("#yes").style.opacity = 0;
  }, 5000);
  setTimeout(function () {
    document.querySelector("#video").style.opacity = 0;
    // location.reload();
  }, 11000);
});

/* const showKaro = (book) => {
  console.log(book.username, book.title);
  let li = document.createElement("li");

  li.innerHTML = `
        <div class="theory mb-2">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                <div class="p-4 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider ">${book.title}</div>
                    <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${book.username}</span> on <span class="text-tailblue tracking-wider">${book.date}</span>.
                    </p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="${book.path}" download="${book.title} eduVerse" id="download-btn">
                        <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                            <i class="ri-download-line mr-2"></i> Download
                        </button>
                    </a>
                    <button class=" text-white text-xl font-bold rounded-full hover:bg-tailblue" id="dlt-btn">
                        <i class="ri-delete-bin-line text-red-400"></i>
                    </button>
                    <button class=" text-white text-2xl font-bold rounded-full hover:bg-tailblue">
                        <i class="ri-bookmark-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

  li.querySelector("#dlt-btn").addEventListener("click", () => {
    if (
      confirm(
        `Are you sure want to delete ${book.title}, which is provided by ${book.username}?`
      ) === true
    )
      pdfDltKaro(book.path);
    else saariPdfDikha(wad);
  });
};

const pdfDltKaro = (bookPath) => {
  console.log(bookPath);
  wad = wad.filter((book) => book.path != bookPath);
  saariPdfDikha(wad);
};


const saariPdfDikha = (wad) => {
  console.log(wad);
  wad.forEach((data) => {
    showKaro(data);
  });
};

let wad = [];

function addBook() {
  fetch('http://192.168.0.105:5000/api/v1/getpdf?subject=cc-302&sem=sem5').then(res => res.json()).then(res => {
    wad = res.data;
    saariPdfDikha(wad);
  })
  fetch('http://192.168.0.105:5000/api/v1/getpdf?subject=cc-305&sem=sem5').then(res => res.json()).then(res => {
    wad = res.data;
    saariPdfDikha(wad);
    console.log("fetch2");
    console.log(wad);
  })
}
addBook(); */