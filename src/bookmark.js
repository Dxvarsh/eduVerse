import bookmarkImg from './assets/img/no-bookmarks.png';
const loginSection = document.getElementById('log-in-section');
const profile = document.getElementById('profile-section');
const bookmarks = document.getElementById('bookmark-section');
const bookmarksDocs = document.getElementById('bookmark-docs');
const uploadByYou = document.getElementById('uploaded-by-you');
const loader = document.querySelector(".loader-main");
const main = document.querySelector("main")
const footer =  document.querySelector('footer');
const sctDiv = document.getElementById('sct-div');
let cUser;

sctDiv.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior:'smooth'
    });
})

var tab = document.querySelectorAll('.tab');
var textContent = document.querySelectorAll('.content');
udaDo();
textContent[0].style.display = "block";
tab[0].style.backgroundColor = "#38bdf8";


tab.forEach(function(tabs, index){
    tabs.addEventListener("click", function(){
        udaDo();
        textContent[index].style.display = "block";
        tab[index].style.backgroundColor = "#38bdf8";
    })
});

function udaDo(){
    textContent.forEach(function(texts, index){
        texts.style.display = 'none';
        tab[index].style.backgroundColor = '#38bdf833';
    })
}

window.addEventListener("scroll", function () {
    footer.classList.toggle("h-0",window.scrollY > 0);
    footer.classList.toggle("py-0",window.scrollY > 0);
    sctDiv.classList.toggle('hidden', window.scrollY === 0);
})

const noBookmarkBigMsg = 'No Bookmarks Found.';

function noBookmarks(container = bookmarksDocs, defaultBigMsg = noBookmarkBigMsg, link = "./index.html", btnText = 'Browse Documents'){
    container.innerHTML = `
        <div class="pointing-up w-full">
            <img src="${bookmarkImg}" alt="" srcset="" class="w-10/12 md:w-1/4 mx-auto -mt-5">
            <p class="text-xl text-center leading-9 font-extrabold text-tailblue -mt-7">${defaultBigMsg}</p>
            <a class="block text-center w-full mt-2" href="${link}">
                <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-[#38bdf8] hover:bg-transparent border border-tailblue transition-colors">
                    ${btnText}
                </button>
            </a>
        </div>
    `;
}

loader.classList.remove("hidden");
main.classList.add("hidden");
footer.classList.add("h-0");
const getUser = () => {
    fetch('https://eduversebackend-hd6t.onrender.com/api/v1/getuser', {
        method: 'GET',
        credentials: 'include'
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(res.status);
        }
        return res.json(); // Assuming response is JSON
    })
    .then((res) => {
        if (res.status_code > 200) {
        } else if (res.status_code === 200) {
            console.log(res.status_code);
            return res.data;
        }
    })
    .then(currentUser => {
        // Example: Initialize any UI or logic that depends on user data here
        loader.classList.add("hidden");
        main.classList.remove("hidden");
        footer.classList.remove("h-0");
        footer.classList.add("py-2");
        profile.classList.remove('hidden');
        bookmarks.classList.remove('hidden');
        cUser = currentUser;
        // Render profile section
        profile.innerHTML = `
            <div id="profile" class="flex relative">
                <div class="profile-pic w-16 h-16 rounded-full overflow-hidden border border-darkblue border-dashed relative mr-3 flex items-center justify-center">
                    <img width="60" height="60" src="https://img.icons8.com/dotty/80/test-account.png" alt="test-account"/>
                </div>
                <div class="profile-info">
                    <h1 class="text-2xl font-semibold">${currentUser.fullname}</h1>
                    <p class="text-lg">@${currentUser.username}</p>
                </div>
                <div id="log-out" class="absolute -right-2 -top-1 flex items-center">
                    <button class="text-white font-semibold w-10 md:w-fit x-2 py-1 md:px-6 md:py-2 border-2 border-red-500 rounded-full bg-red-500 hover:bg-transparent transition-all" id="logout">
                        <span class="hidden md:block">Logout</span>
                        <i class="ri-shut-down-line text-xl md:hidden"></i>
                    </button>
                </div>
            </div>`
        ;

        // Attach logout button event listener
        document.getElementById('logout').addEventListener('click', () => {
            if(confirm('Are you sure want to log out?')){
                fetch('https://eduversebackend-hd6t.onrender.com/api/v1/logout', {
                    method: 'GET',
                    credentials: 'include'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Logout request failed');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Logout successful:', data);
                    loginSection.classList.remove('hidden');
                    loginSection.innerHTML = `
                        <div class="w-fit md:w-fit p-8 rounded-lg bg-red-300">
                            <h2 class="text-2xl font-semibold">🚫Abhi bhi time hai log in kr le🥲</h2>
                            <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="refresh">Log in</button>
                            <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="home">Nahi karuga</button>
                        </div>`
                    ;
                    profile.classList.add('hidden');
                    bookmarks.classList.add('hidden');
                    document.querySelector("#refresh").addEventListener('click', ()=>{window.location.replace('./login.html');})
                    document.querySelector("#home").addEventListener('click', ()=>{window.location.replace('./home.html');})
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                    // Handle error, display error message, etc.
                    showNotification('Error while logging out', 'red');
                });
            }
            
        });

        // Fetch bookmarks
        fetch('https://eduversebackend-hd6t.onrender.com/api/v1/bookmarks', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bookmarks');
            }
            return response.json();
        })
        .then(data => {
            bookmarksDocs.innerHTML = ``;
            // {"data":{},"message":"No Bookmarks","status_code":200}
            if(data.message == 'No Bookmarks')
                noBookmarks();
            else
                saariPdf(data.data)
            
        })
        .catch(error => {
            console.error('Error fetching bookmarks:', error);
        });

        fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/allpdf`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            if (res.status_code > 200) {
                showNotification(res.message, 'red');
            } else if (res.status_code === 200) {
                let allpdf = [];

                allpdf = res.data;
                
                allpdf = allpdf.filter(book => book.username === currentUser.username);
                allpdf = allpdf.map(book => {
                    return { ...book, apiName: 'allDoc' };
                });
                allpdf.forEach(book => console.log(book, '--188'));
                
                if(allpdf.length === 0){
                    noBookmarks(uploadByYou, 'There is no PDF Uploaded by you..!' ,'./addDoc.html', 'Upload PDF');
                }
                else{
                    saariPdf2(allpdf);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching PDFs:', error);
            showNotification('Failed to fetch PDFs', 'red');
        })
    })
    .catch(error => {
        console.error('Error:', error);
        loader.classList.add("hidden");
        main.classList.remove("hidden");
        loginSection.classList.remove('hidden');

        loginSection.innerHTML = `
            <div class="w-fit md:w-fit p-8 rounded-lg bg-red-300">
            <h2 class="text-2xl font-semibold">🚫You are not Logged in.</h2>
                <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="refresh">Log in</button>
                <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="home">Back</button>
            </div>`
        ;
        document.querySelector("#refresh").addEventListener('click', ()=>{window.location.replace('./login.html');})
        document.querySelector("#home").addEventListener('click', ()=>{window.location.replace('./home.html');})
    })
}
getUser();
        
const showKaro = (book) => {
    console.log(book);
    const {
        title,
        username : uploaderUserName,
        date,
        path,
        sem,
        Sem,
        subject,
        apiName
    } = book;
    
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="theory mb-2 border border-tailblue rounded">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex relative md:pt-2">
                <div class="px-4 pb-4 md:w-[70%] pt-6">
                    <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                    <p class="text-gray-300 text-base">Uploaded by <span class="text-tailblue tracking-wider">${uploaderUserName}</span> on <span class="text-tailblue tracking-wider">${date}</span>.
                    </p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="https://drive.usercontent.google.com/u/0/uc?id=${path}&export=download" id="prev-btn">
                        <button class="text-white text-lg font-bold py-2 px-4 rounded-full tracking-wide bg-[#38bdf8] hover:bg-transparent border border-tailblue transition-colors" id="${path}">
                            <i class="ri-download-line mr-2"></i> Download
                        </button>
                    </a>

                    <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-red-500 hover:bg-transparent border border-red-500 transition-colors dlt-btn ${(String(cUser?.username) === uploaderUserName) || cUser?.isadmin ? "block" : "hidden"}" id="${path}">
                        <i class="ri-delete-bin-line hover:text-red-400" id="${path}"></i> Delete
                    </button>
                    
                    <button class="${(apiName === 'allDoc') ? "hidden" : "block"} text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-1.5 bookmark-btn">
                        <i class="ri-bookmark-fill" id="${path}"></i>
                    </button>
                </div>
                <p class="rounded-full px-2 py-1 text-gray-300 text-xs absolute bg-slate-900 top-1 right-1 md:right-1/2">Document Location: <span class="text-tailblue tracking-wider">Sem: ${(apiName === 'allDoc') ?  Sem : sem}, ${subject}</span>.</p>
            </div>
        </div>`;


        li.querySelector('.dlt-btn').addEventListener('click', (e) => {
            const path = e.target.id;
            if (confirm("Are you sure you want to delete?")) {
                fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/deletepdf/${path}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status_code === 200) {
                        showNotification('PDF deleted successfully', 'green');
                        const bookIdTag = document.getElementById(path)
                        const parentLi = bookIdTag.closest('li');
                        console.log(parentLi, 'line 292');
                        if (parentLi) {
                            parentLi.remove(); // Remove the <li> element
                        }
                        if(uploadByYou.children.length == 0)
                            noBookmarks(uploadByYou, 'There is no PDF Uploaded by you..!' ,'./addDoc.html', 'Upload PDF');
                        
                    } else {
                        throw new Error('Failed to delete PDF');
                    }
                })
                .catch(error => {
                    console.error('Error deleting PDF:', error);
                    showNotification('Failed to delete PDF', 'red');
                });
            }
        });
        

        li.querySelector('.bookmark-btn').addEventListener('click', (e) => {
            const path = e.target.id;
            fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/deletebookmark/${path}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Bookmark API request failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Bookmark removed successfully:', data);
                showNotification('Bookmark removed successfully', 'green');
                const bookIdTag = document.getElementById(path)
                const parentLi = bookIdTag.closest('li');
                if (parentLi) {
                    parentLi.remove(); // Remove the <li> element
                }
                if(bookmarksDocs.children.length == 0)
                    noBookmarks();
                })
            .catch(error => {
                console.error('Error adding bookmark:', error);
            });
        });
    return li;
}


const saariPdf = (pdf) =>{
    pdf.forEach((book) => {
        let li = showKaro(book);
        bookmarksDocs.appendChild(li);
    });
}
const saariPdf2 = (pdf) =>{
    pdf.forEach((book) => {
        console.log(uploadByYou);
        let li = showKaro(book);
        uploadByYou.appendChild(li);
    });
}

const showNotification = (message, color) => {
    const notification = document.querySelector("#notification");
    notification.innerHTML = `
        <div class="w-full px-4 py-2 rounded-lg text-${color}-600 font-extrabold border border-${color}-700 bg-${color}-200 drop-shadow-sm">
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
noBookmarks();