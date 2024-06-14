/*Individual  Subject Tab script */
let tab = document.querySelectorAll('.tab');
let textContent = document.querySelectorAll('.content');

console.log(tab, textContent);

textContent[0].style.display = "block";
tab[0].style.borderColor = "#38bdf8";
tab[0].style.color = "#38bdf8";


tab.forEach(function(tabs, index){
    tabs.addEventListener("click", function(){
        udaDo();
        textContent[index].style.display = "block";
        tab[index].style.borderColor = "#38bdf8";
        tab[index].style.color = "#38bdf8";
    })
});

function udaDo(){
    textContent.forEach(function(texts, index){
        console.log(texts);
        texts.style.display = 'none';
        tab[index].style.borderColor = '#ffffff';
        tab[index].style.color = '#ffffff';
    })
}





function generateContent(containerSelector, data, downloadPrefix) {
    let container = document.querySelector(containerSelector);
    let content = '';
    console.log(data);
    data.forEach(function(elem) {
        let downloadText = downloadPrefix ? `${elem.subject} ${downloadPrefix}` : `${elem.subject}`;
        let downloadLink = elem.book_link ? `<a href="${elem.book_link}" download="${downloadText}">` : '';
        content += `
        <div class="theory mb-2">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                <div class="p-4 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider ">${elem.subject}</div>
                    <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${elem.provider_name}</span>.
                    </p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    ${downloadLink}
                        <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                            <i class="ri-download-line mr-2"></i> Download
                        </button>
                    </a>
                    <button class=" text-white text-xl font-bold rounded-full hover:bg-tailblue">
                        <i class="ri-delete-bin-line text-red-400"></i>
                    </button>
                    <button class=" text-white text-2xl font-bold rounded-full hover:bg-tailblue">
                        <i class="ri-bookmark-line"></i>
                    </button>
                </div>
            </div>
        </div>
        `;

        let dltBtn = document.querySelector(".ri-delete-bin-line");
        console.log(dltBtn);
        // dltBtn.addEventListener("click", (e) =>{
        //     console.log(e);
        //     console.log("btn click hua");
        // })
    });
    if(container){
        container.innerHTML = content;
    }
}

function dbms2Theory() {
    let theoryData = [
        {id: Math.random()*1000, subject: "CC-208 DBMS-II Unit-1", provider_name: "@saumya.038", book_link: "./DBMS/DBMS-2 Unit 1 (T).pdf" },
        {id: Math.random()*1000, subject: "CC-208 DBMS-II Unit-2", provider_name: "@ayush", book_link: "./DBMS/DBMS-2 Unit 2 (T).pdf" },
        {id: Math.random()*1000, subject: "CC-208 DBMS-II Unit-3", provider_name: "@eduVerse", book_link: "./DBMS/DBMS-2 Unit 3 (T).pdf" },
        {id: Math.random()*1000, subject: "CC-208 DBMS-II Unit-4", provider_name: "@saumya.038", book_link: "./DBMS/DBMS-2 Unit 4 (T).pdf" },
        {id: Math.random()*1000, subject: "Computer World CC-208 DBMS-II", provider_name: "@saumya.038", book_link: "./DBMS/DBMS-2 CC-208 & 212.pdf" },
    ];
    generateContent(".dbms2-theory", theoryData, "eduVerse");
}

function dbms2OldPaper() {
    let oldPaperData = [
        {id: Math.random()*1000, subject: "2019 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2020 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2021 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2022 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2023 CC-208 DBMS-II", provider_name: "@eduVerse" },
    ];
    generateContent(".dbms2-old-paper", oldPaperData);
}

function saqtTheory() {
    let theoryData = [
        {id: Math.random()*1000, subject: "CC-209 SAQT Unit 1", provider_name: "@saumya.038", book_link: "./SAQT/system analysis Unit 1 (T).pdf" },
        {id: Math.random()*1000, subject: "CC-209 SAQT Unit 2", provider_name: "@ayush", book_link: "./SAQT/system analysis Unit 2 (T).pdf" },
        {id: Math.random()*1000, subject: "CC-209 SAQT Unit 3", provider_name: "@eduVerse", book_link: "./SAQT/system analysis Unit 3 (T).pdf" },
        {id: Math.random()*1000, subject: "CC-209 SAQT Unit 4", provider_name: "@saumya.038", book_link: "./SAQT/system analysis Unit 4 (T).pdf" },
        {id: Math.random()*1000, subject: "Computer World CC-209 SAQT", provider_name: "@saumya.038", book_link: "./SAQT/SAQT CC-209.pdf" },
    ];
    generateContent(".saqt-theory", theoryData, "eduVerse");
}

function saqtOldPaper() {
    let oldPaperData = [
        {id: Math.random()*1000, subject: "2019 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2020 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2021 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2022 CC-208 DBMS-II", provider_name: "@eduVerse" },
        {id: Math.random()*1000, subject: "2023 CC-208 DBMS-II", provider_name: "@eduVerse" },
    ];
    generateContent(".saqt-old-paper", oldPaperData);
}

dbms2Theory();
dbms2OldPaper();
saqtTheory();
saqtOldPaper();