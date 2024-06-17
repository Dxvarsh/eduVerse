// /*Individual  Subject Tab script */
// let tab = document.querySelectorAll('.tab');
// let textContent = document.querySelectorAll('.content');

// console.log(tab, textContent);

// textContent[0].style.display = "block";
// tab[0].style.borderColor = "#38bdf8";
// tab[0].style.color = "#38bdf8";


// tab.forEach(function(tabs, index){
//     tabs.addEventListener("click", function(){
//         udaDo();
//         textContent[index].style.display = "block";
//         tab[index].style.borderColor = "#38bdf8";
//         tab[index].style.color = "#38bdf8";
//     })
// });

// function udaDo(){
//     textContent.forEach(function(texts, index){
//         console.log(texts);
//         texts.style.display = 'none';
//         tab[index].style.borderColor = '#ffffff';
//         tab[index].style.color = '#ffffff';
//     })
// }


let addDocForm = document.querySelector("#add-doc-form")
let subjectSem5Inp = document.querySelector("#subject-sem5");
let pdfNameInp = document.querySelector("#pdf-name");
let fileInp = document.querySelector("#file-input");

const wadContainer = document.querySelector("#subject-list-cc-301")
const wadOldContainer = document.querySelector("#subject-list-cc-301-old-paper")


let wad = [

    {
        id: Math.floor(Math.random()*100),
        subject: "jethalal gada",
        pdfName: "sem6 syllabus",
        providerName: "@jethalal gada",
        link: "./DOCS/BCA SEM 6 SYLLABUS-feb 2020.pdf"
    },
    
    {
        id: Math.floor(Math.random()*100),
        subject: "jethalal gada",
        pdfName: "sem6 syllabus",
        providerName: "@jethalal gada",
        link: "./DOCS/BCA SEM 6 SYLLABUS-feb 2020.pdf"
    },

    {
        id: Math.floor(Math.random()*100),
        subject: "cc-301",
        pdfName: "sem5 Syllabus",
        providerName: "@Jayantilal gada",
        link: "./DOCS/Syllabus BCA Semester 5 2019.pdf"
    },

];


addDocForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // console.log("hellow submit");

    const subjectSem5 = subjectSem5Inp.value.trim();
    const pdfName = pdfNameInp.value.trim();
    const file = fileInp.value;

    addBook(subjectSem5, pdfName, file);


    subjectSem5Inp.value = "";
    pdfNameInp.value = "";

    alert(`${pdfName} Added Successfully`)

})
    
    
const addBook = (subjectSem5, pdfName, file) => {
        // console.log(subjectSem5);
        // console.log(pdfName);
        // console.log(providerName);
        // console.log(file);

    const book = {
        id: Date.now(),
        subject: subjectSem5,
        pdfName: pdfName,
        link: file
    }

    wad.push(book);
    showKaro(book);
}

const showKaro = (book) => {
    // console.log(book.id, book.providerName);

    let li = document.createElement('li');

    li.innerHTML = 
    `
        <div class="theory mb-2">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                <div class="p-4 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider ">${book.pdfName}</div>
                    <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${book.providerName}</span> on <span class="text-tailblue tracking-wider">{Date}</span>.
                    </p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="${book.link}" download="${book.pdfName} eduVerse" id="download-btn">
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
        // console.log(book.id);
        if(confirm(`You want to delete ${book.pdfName}, which is provided by ${book.providerName}?`) === true)
            pdfDltKaro(book.id);
        else saariPdfDikha();
    });



    if(book.subject === 'cc-301') wadContainer.appendChild(li);
    else wadOldContainer.appendChild(li);
}




const pdfDltKaro = (bookId) => {
    console.log(bookId);
    wad = wad.filter(book => book.id != bookId)
    saariPdfDikha();
}


const saariPdfDikha = () => {
    wadContainer.innerHTML = '';
    wadOldContainer.innerHTML = '';

    wad.forEach((data) => {
        showKaro(data)
    })
}

saariPdfDikha();