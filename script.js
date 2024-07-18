/* 
    *** back Button ***
*/
function reloadPage(){
    location.reload();
}

/* 
    *** Sem and subject selection ***
*/
function selectedSem(semId) {
    console.log(semId);
    let semContainer = document.querySelectorAll('.container');
    semContainer.forEach(sem => {
        sem.style.display = 'none';
    })
    const semester = document.querySelector('input[type="radio"]:checked').value;
    
    document.getElementById(semId).style.display = 'block';
    
    const semSelection = document.getElementById('sem-selection');
    semSelection.style.display = 'none';

    let subject = document.querySelectorAll('select')
    subject.forEach(sub => {
        sub.addEventListener('change', (e) => {
            subject = e.target.value;
            selectKar(semester, subject);
        })
    })
}
let pdfHolder=[];
const selectKar = (semester, subject) => {

    document.getElementById(`pdf-container-sem1`).innerHTML="";
    document.getElementById(`pdf-container-sem2`).innerHTML="";
    document.getElementById(`pdf-container-sem3`).innerHTML="";
    document.getElementById(`pdf-container-sem4`).innerHTML="";
    document.getElementById(`pdf-container-sem5`).innerHTML="";
    document.getElementById(`pdf-container-sem6`).innerHTML="";
    /* for (let i = 0; i < 7; i++) { 
        document.getElementById(`pdf-container-sem${i}`).innerHTML = "";
    } */
    console.log(`${semester}, ${subject}`);
    
    if(semester === 'sem1'){
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/getpdf?subject=${subject}&sem=1`)
       .then(res => res.json())
       .then(res => {
            pdfHolder = [];
            pdfHolder = res.data;
            saariPdf(pdfHolder);
       });
    }
    else if(semester === 'sem2'){
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/getpdf?subject=${subject}&sem=2`)
       .then(res => res.json())
       .then(res => {
            pdfHolder = [];
            pdfHolder = res.data;
            saariPdf(pdfHolder);
       });
    }
    else if(semester === 'sem3'){
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/getpdf?subject=${subject}&sem=3`)
       .then(res => res.json())
       .then(res => {
            pdfHolder = [];
            pdfHolder = res.data;
            saariPdf(pdfHolder);
       });
    }
    else if(semester === 'sem4'){
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/getpdf?subject=${subject}&sem=4`)
       .then(res => res.json())
       .then(res => {
            pdfHolder = [];
            pdfHolder = res.data;
            saariPdf(pdfHolder);
       });
    }
    else if(semester === 'sem5'){
        console.log("in sem 5");
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/getpdf?subject=${subject}&sem=5`)
       .then(res => res.json())
       .then(res => {
            console.log(res.data);
            pdfHolder = [];
            pdfHolder = res.data;
            saariPdf(pdfHolder);
       });
    }
    else if(semester === 'sem6'){
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/getpdf?subject=${subject}&sem=6`)
       .then(res => res.json())
       .then(res => {
            pdfHolder = [];
            pdfHolder = res.data;
            saariPdf(pdfHolder);
       });
    }
    else{
        console.log("Invalid semester");
    }
}


const showKaro = (book, index) => {
    let li = document.createElement("li");
    console.log(book);
    const {
        title,
        username,
        date,
        path,
        Sem
    } = book;

    console.log(title, username, date, path, Sem);
    
    li.innerHTML = `
        <div class="theory mb-2">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                <div class="p-4 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider ">${title}</div>
                    <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${username}</span> on <span class="text-tailblue tracking-wider">${date}</span>.
                    </p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="https://kirtanmojidra.pythonanywhere.com/api/v1/pdf/${path}" download="${title} eduVerse" id="download-btn">
                        <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                            <i class="ri-download-line mr-2"></i> Download
                        </button>
                    </a>

                    
                    <a href="https://kirtanmojidra.pythonanywhere.com/api/v1/deletepdf/${path}">
                        <button class=" text-white text-xl font-bold rounded-full hover:bg-tailblue px-2 py-2 dlt-btn" id="${path}">
                            <i class="ri-delete-bin-line text-red-400"></i>
                        </button>
                    </a>
                    <button class=" text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-2">
                        <i class="ri-bookmark-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById(`pdf-container-sem${Sem}`).appendChild(li);
}


const saariPdf = (pdf) =>{
    pdf.forEach((book, index) => {
        showKaro(book, index);
    });
}