import bookmarkImg from './assets/img/no-bookmarks.png';
const loader = document.querySelector(".loader-main");
const innerLoader = document.querySelector('#inner-loader')
const main = document.querySelector("main");
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');
const sctDiv = document.getElementById('sct-div');
const scrollToTop = document.getElementById('scroll-to-top');
const sctPng = document.getElementById('sct-png');
const searchBox = document.getElementById('search-box');
const pdfContainer = document.getElementById('pdf-container');

let pdfsData = [];

document.getElementById('menu-btn').addEventListener('click', function() {
    const bottomNav = document.getElementById('bottom-nav');
    const menuIcon = document.getElementById('menu-icon');
    nav.classList.toggle('h-fit');
    bottomNav.classList.toggle('hidden');
    menuIcon.classList.toggle('ri-menu-line');
    menuIcon.classList.toggle('ri-close-line');
});

// Function to filter and display PDFs based on the search query
const searchPDFs = (searchQuery) => {
    const filteredPDFs = pdfsData.filter(pdf => {
        return pdf.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
    console.log('-------------filteredPDFs', filteredPDFs);
    
    pdfContainer.innerHTML = '';
    if(filteredPDFs.length > 0) {
        filteredPDFs.forEach(pdf => showKaro(pdf));
    }else{
        pdfContainer.innerHTML = `
            <div class="pointing-up">
                <img src="${bookmarkImg}" alt="" srcset="" class="w-10/12 md:w-1/4 mx-auto -mt-5">
                <p class="text-xl text-center leading-9 font-extrabold text-tailblue -mt-5">No Results Found.</p>
                <p class="text-sm text-center font-semibold text-white">No PDFs found with the given search query. Please try with different keywords.</p>
            </div>
        `;
    }
};

searchBox.addEventListener('input', () => {
    const searchQuery = searchBox.value.trim();
    searchPDFs(searchQuery);
});

/* No data Found */
function noBookmarks(){
    document.getElementById(`pdf-container`).innerHTML = `
        <div class="pointing-up">
            <img src="${bookmarkImg}" alt="" srcset="" class="w-10/12 md:w-1/4 mx-auto -mt-5">
            <p class="text-xl text-center leading-9 font-extrabold text-tailblue -mt-5">No Bookmarks Found.</p>
            <p class="text-sm text-center font-semibold text-white">You haven’t saved any documents yet. Bookmark your essential Documents/PDF for easy to access!.</p>
        </div>
    `;
}

/* On Scroll effects */
sctDiv.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior:'smooth'
    });
})
window.addEventListener("scroll",function(){
    const footer = document.querySelector('footer')
    footer.classList.toggle("h-fit",window.scrollY > 0);
    footer.classList.toggle("py-2",window.scrollY > 0);
    sctDiv.classList.toggle('hidden', window.scrollY === 0);
})

/* main loader */
const showLoader = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loader.classList.remove("hidden");
    main.classList.add("hidden");
};
const hideLoader = () => {
    loader.classList.add("hidden");
    main.classList.remove("hidden");
};

/* Inner Loader */
const showInnerLoader = () => {
    innerLoader.classList.remove("hidden");
};
const hideInnerLoader = () => {
    innerLoader.classList.add("hidden");
};

showLoader();

let currentUser = null;
const getUser = () => {
    if (currentUser) {
        console.log(currentUser, 'line 99');
        return Promise.resolve(currentUser);
    }
    
    return fetch('https://eduversebackend-hd6t.onrender.com/api/v1/getuser', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(user => {
        hideLoader();
        if (user.status_code > 200) {
            console.log(currentUser);
            currentUser = 'j8!#uB%K3dFj9^+z7@z*Lf6$kG7E5Y8Q-Md2&p_sNx&]3SWG.}#Mo8|Z_U/L1J&[wU~Q3k3&b8q5LkzC^E)FkZ+A{H}^S.7*7!|q%h@]xKQ_mVe?Y,E#N:s|O+w'
            console.log(currentUser, 'line 113');
            throw new Error(user.status_code, 'line 111');
        } else {
            currentUser = user.data; // Store the user data
            return currentUser;
        }
    })
    .catch(error => {
        console.error('Error fetching user:', error);
        if (error.message === '401') {
            // Handle unauthorized error
        }
    });
};



const saariPdf = (pdfs) => {
    pdfs.forEach(pdf => showKaro(pdf));
};

showInnerLoader();
getUser().then( user => {
    fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/allpdf`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(res => {
        hideInnerLoader();
        if (res.status_code > 200) {
            showNotification(res.message, 'red');
        } else if (res.status_code === 200) {
            console.log(res.data);
            pdfsData = res.data;
            saariPdf(pdfsData);
        }
    })
    .catch(error => {
        console.error('Error fetching PDFs:', error);
        showNotification('Failed to fetch PDFs', 'red');
    })
})

const convertToISODate = (customDate) => {
    // Example customDate: "Tuesday-20-08-24"
    const parts = customDate.split('-');
    const day = parts[1];
    const month = parts[2];
    const year = parts[3];
    // Adjust year to be 2000s (e.g., '24' becomes '2024')
    const fullYear = `20${year}`;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Display PDFs, optionally filtered by date
const displayPDFs = (filterDate = null) => {
    pdfContainer.innerHTML = '';

    pdfsData.forEach(pdf => {
        const pdfDate = convertToISODate(pdf.date); // Convert date format
        
        // Display PDF if no filterDate or if it matches the filterDate
        if (!filterDate || pdfDate === filterDate) {
            showKaro(pdf);
        }
    });
};


// Event listener for checkbox
document.getElementById('recents').addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    // Set filterDate to today's date if checked, otherwise no filter
    const filterDate = isChecked ? new Date().toISOString().split('T')[0] : null;
    console.log(`Checkbox checked: ${isChecked}, filterDate: ${filterDate}`);
    displayPDFs(filterDate);
});



const showKaro = (pdf = null) => {
    const {
        id, title, username : uploaderUserName, date, path, Sem, subject, isBookmarked
    } = pdf;

    console.log(pdf);
    let bookmark = isBookmarked === 'true';
    console.log(currentUser?.username);

    
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="theory mb-2 border border-tailblue rounded">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex relative">
                <div class="px-4 pb-4 pt-6 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                    <p class="text-gray-300 text-base">Uploaded by <span class="text-tailblue tracking-wider">${uploaderUserName}</span> on <span class="text-tailblue tracking-wider">${date}</span>.</p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="https://drive.google.com/file/d/${path}/preview" id="prev-btn">
                        <button class="text-white text-lg font-bold py-2 px-4 rounded-full tracking-wide bg-[#38bdf8] hover:bg-transparent border border-tailblue transition-colors" id="${path}">
                            <i class="ri-eye-line mr-2"></i> Preview
                        </button>
                    </a>

                    <a href="https://drive.usercontent.google.com/u/0/uc?id=${path}&export=download" class="${currentUser?.isadmin ? "hidden" : "block"}">
                        <button class="text-white text-2xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5">
                            <i class="ri-download-line"></i>
                        </button>    
                    </a>

                    <button class="text-white text-xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5 dlt-btn ${currentUser?.isadmin ? "block" : "hidden"}" id="${path}">
                        <i class="ri-delete-bin-line text-red-400" id="${path}"></i>
                    </button>
                    
                    <button class="text-white text-2xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5 bookmark-btn" id="${path}">
                        <i class="${bookmark ? "ri-bookmark-fill" : "ri-bookmark-line"}" id="${path}" bookmark-btn-icon></i>
                    </button>
                </div>
                <p class="rounded-full px-2 py-1 text-gray-300 text-xs absolute bg-slate-900 top-1 right-1 md:right-1/2">Doc Location: <span class="text-tailblue tracking-wider">Sem: ${Sem}, ${subject}</span>.</p>
            </div>
        </div>

        `;


    li.querySelector('#prev-btn').addEventListener('click', e =>{

        console.log('clicked');
        const path = e.target.id;
        fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/pdf/${path}`,{
            method: 'get',
            credentials: 'include',

        }).then( res => res.json())
        .then( res =>{
                if(res.status_code === 200) {
                    window.location.replace(res.data.path);
                }
            }
        )
        // window.location.replace("./home.html");
    })

    li.querySelector('.dlt-btn').addEventListener('click', (e) => {
        const path = e.target.id;
        showInnerLoader();
        if (confirm("Are you sure you want to delete?")) {
            fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/deletepdf/${path}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    hideInnerLoader();
                    if (data.status_code === 200) {
                        showNotification('PDF deleted successfully', 'green');
                        const bookIdTag = document.getElementById(path)
                        const parentLi = bookIdTag.closest('li');
                        console.log(parentLi, 'line 269');
                        if (parentLi) {
                            parentLi.remove(); // Remove the <li> element
                        }
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
        const bookmarkIcon = li.querySelector('[bookmark-btn-icon]');
        const path = e.target.id;
        showInnerLoader();

        const apiUrl = bookmark ? `https://eduversebackend-hd6t.onrender.com/api/v1/deletebookmark/${path}` : `https://eduversebackend-hd6t.onrender.com/api/v1/bookmark/${path}`;
        const successMessage = bookmark ? 'Bookmark removed successfully' : 'PDF bookmarked';
        const failureMessage = bookmark ? 'Failed to remove bookmark' : 'Failed to bookmark PDF';
        
        fetch(apiUrl, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                hideInnerLoader();
                if (data.status_code === 200) {
                    showNotification(successMessage, 'green');
                    bookmark = !bookmark; 

                    if(bookmark){
                        bookmarkIcon.classList.remove('ri-bookmark-line');
                        bookmarkIcon.classList.add('ri-bookmark-fill');
                    }else{
                        bookmarkIcon.classList.remove('ri-bookmark-fill');
                        bookmarkIcon.classList.add('ri-bookmark-line');
                    }
                } else {
                    throw new Error(failureMessage);
                }
            })
            .catch(error => {
                console.error('Error updating bookmark:', error);
                showNotification(failureMessage, 'red');
            });
    });

    document.getElementById(`pdf-container`).appendChild(li);
       
};



const showNotification = (message, color) => {
    const notification = document.querySelector("#notification");
    notification.innerHTML = `
        <div class="w-full px-4 py-2 rounded-lg text-${color}-500 font-extrabold border border-${color}-500 bg-${color}-200 drop-shadow-sm">
            <h2 class="text-xl text-center drop-shadow-2xl">${message}</h2>
        </div>`;
    notification.style.opacity = 1;
    notification.classList.add('bottom-16');

    setTimeout(() => {
        notification.classList.remove('bottom-16');
        notification.classList.add('-bottom-20');
        notification.style.opacity = 0;
    }, 3000);
};