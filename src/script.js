// DOM elements
import selectSemImg from './assets/img/select-sem.png'
const loader = document.querySelector(".loader-main");
const main = document.querySelector("main");
const greet = document.getElementById("greeting");
const loginbtn2 = document.getElementById("log-in-btn2");
const semesters = document.querySelectorAll('input[type="radio"]');
const semContainers = document.querySelectorAll('.container');
const backbtn = document.querySelectorAll('#back-btn');
const semSelection = document.getElementById('sem-selection');
const subjects = document.querySelectorAll('select');
const footer = document.querySelector('footer');
let currentSem = ''; 

// Function to fetch user information
const getUser = () => {
    return fetch('https://eduversebackend-hd6t.onrender.com/api/v1/getuser', {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(user => {
            if (user.status_code > 200) {
                throw new Error(user.status_code);
            } else {
                sayHello(user.data.fullname);
                return user.data; // Assuming user.data contains the user information
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            loginbtn2.classList.remove('hidden');
            if (error.message === '401') {
                sayHello(); // Handle unauthorized access
            }
        });
};

// Function to display a greeting message
function sayHello(user = 'Buddy') {
    greet.innerHTML = `
        <h1 class="text-white text-3xl font-monument">Hellow, 👋<br><span class="text-tailblue">${user}</span></h1>
    `;
}

function selectSemPNG(){
    for (let i = 1; i <= 6; i++) {
        if (i == String(currentSem))
            continue
        else{
            document.getElementById(`pdf-container-sem${i}`).innerHTML = "";
            document.getElementById(`pdf-container-sem${i}`).innerHTML = `
                <div class="pointing-up">
                    <img src="${selectSemImg}" alt="" srcset="" class="w-10/12 mx-auto">
                    <span class="text-xl text-center leading-9 font-extrabold text-tailblue mt-4">Select Subject using this dropdown.</span>
                </div>
            `;
        }
    }
}
selectSemPNG();

// Event listener for scroll to toggle popup class
window.addEventListener("scroll", function () {
    footer.classList.toggle("h-fit",window.scrollY > 0);
    footer.classList.toggle("py-2",window.scrollY > 0);
    const practicalPopups = document.querySelectorAll('#practical-popup');
    practicalPopups.forEach(popup => {
        popup.classList.toggle("-bottom-96", window.scrollY > 0);
    });
});

// Event listener for back button
backbtn.forEach(back => {
    back.addEventListener('click', () => {
        semContainers.forEach(container => container.style.display = 'none');
        semesters.forEach(button => button.checked = false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        semSelection.style.display = 'block';
        document.getElementById('greet-area').classList.remove('h-0');
    });
});

function handleSubjectChange(e) {
    const selectedSubject = e.target.value;
    console.log(`line 80: Subject = ${selectedSubject}, selected sem = ${currentSem}`);
    
    // Call the function to fetch PDFs
    selectKar(currentSem, selectedSubject);
}

// Event listener for radio button change
semesters.forEach(radio => {
    radio.addEventListener('change', () => {
        selectSemPNG();
        currentSem = radio.value;
        subjects.forEach(sub =>  {
            sub.selectedIndex = 0
            console.log('line-97', sub);
            
            console.log('line-99', sub.selectedIndex);
        });
        selectSemPNG();
        semContainers.forEach(container => {
            container.style.display = container.id === `container-sem${currentSem}` ? 'block' : 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        semSelection.style.display = 'none';
        document.getElementById('greet-area').classList.add('h-0');
        // Remove previous event listeners
        subjects.forEach(sub => {
            sub.removeEventListener('change', handleSubjectChange);
        });
        // Add new event listeners
        subjects.forEach(sub => {
            sub.addEventListener('change', handleSubjectChange);
        });
    });
});

// Function to fetch PDFs based on semester and subject
const selectKar = (semester, subject) => {
    loader.classList.remove("hidden");
    main.classList.add("hidden");

    // Clear previous PDF containers
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`pdf-container-sem${i}`).innerHTML = "";
    }

    fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/getpdf?subject=${subject}&sem=${semester}`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(res => {
            loader.classList.add("hidden");
            main.classList.remove("hidden");

            if (res.status_code > 200) {
                showNotification(res.message, 'red');
            } else if (res.status_code === 200) {
                saariPdf(res.data);
            }
        })
        .catch(error => {
            console.error('Error fetching PDFs:', error);
            showNotification('Failed to fetch PDFs', 'red');
        });
};

// Function to display PDFs
const saariPdf = (pdfs) => {
    pdfs.forEach(pdf => showKaro(pdf));
};

// Function to display individual PDF item
const showKaro = (pdf) => {
    const {
        title, username, date, path, Sem, subject, isBookmarked
    } = pdf;

    let bookmark = isBookmarked === 'true';
    getUser().then(currentUser => {
        const {
            username: currentUserUsername
        } = currentUser ?? {};
        console.log('--line 133',String(username));
        
        
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="theory mb-2 border border-tailblue rounded">
                <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                    <div class="p-4 md:w-[70%]">
                        <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                        <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${username}</span> on <span class="text-tailblue tracking-wider">${date}</span>.</p>
                    </div>
                    <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                        <a href="https://eduversebackend-hd6t.onrender.com/api/v1/pdf/${path}" id="download-btn">
                            <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                                <i class="ri-download-line mr-2"></i> Download
                            </button>
                        </a>
                        <button class="text-white text-xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5 dlt-btn ${String(currentUserUsername) === username ? "block" : "hidden"}" id="${path}">
                            <i class="ri-delete-bin-line text-red-400" id="${path}"></i>
                        </button>
                        <button class="text-white text-2xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5 bookmark-btn" id="${path}">
                            <i class="${bookmark ? "ri-bookmark-fill" : "ri-bookmark-line"}" id="${path}" bookmark-btn-icon></i>
                        </button>
                    </div>
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

            const apiUrl = bookmark ? `https://eduversebackend-hd6t.onrender.com/api/v1/deletebookmark/${path}` : `https://eduversebackend-hd6t.onrender.com/api/v1/bookmark/${path}`;
            const successMessage = bookmark ? 'Bookmark removed successfully' : 'PDF bookmarked';
            const failureMessage = bookmark ? 'Failed to remove bookmark' : 'Failed to bookmark PDF';
            
            fetch(apiUrl, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
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

        document.getElementById(`pdf-container-sem${Sem}`).appendChild(li);
    }).catch(error => {
        console.error('Error fetching user:', error);
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="theory mb-2">
                <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                    <div class="p-4 md:w-[70%]">
                        <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                        <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${username}</span> on <span class="text-tailblue tracking-wider">${date}</span>.</p>
                    </div>
                    <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                        <a href="https://eduversebackend-hd6t.onrender.com/api/v1/pdf/${path}" id="download-btn">
                            <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                                <i class="ri-download-line mr-2"></i> Download
                            </button>
                        </a>
                        <button class="text-white text-xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5 dlt-btn">
                            <i class="ri-delete-bin-line text-red-400" id="${path}"></i>
                        </button>
                        <button class="text-white text-2xl font-bold rounded-full active:bg-tailblue hover:bg-tailblue px-2 py-1.5 bookmark-btn" id="${path}">
                            <i class="${bookmark ? "ri-bookmark-fill" : "ri-bookmark-line"}" id="${path}" bookmark-btn-icon></i>
                        </button>
                    </div>
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

            const apiUrl = bookmark ? `https://eduversebackend-hd6t.onrender.com/api/v1/deletebookmark/${path}` : `https://eduversebackend-hd6t.onrender.com/api/v1/bookmark/${path}`;
            const successMessage = bookmark ? 'Bookmark removed successfully' : 'PDF bookmarked';
            const failureMessage = bookmark ? 'Failed to remove bookmark' : 'Failed to bookmark PDF';

            if (!bookmark) {
                bookmarkIcon.classList.remove('ri-bookmark-line');
                bookmarkIcon.classList.add('ri-bookmark-fill');
            } else {
                bookmarkIcon.classList.remove('ri-bookmark-fill');
                bookmarkIcon.classList.add('ri-bookmark-line');
            }

            fetch(apiUrl, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status_code === 200) {
                        showNotification(successMessage, 'green');
                        bookmark = !bookmark; // Toggle bookmark state
                    } else {
                        throw new Error(failureMessage);
                    }
                })
                .catch(error => {
                    console.error('Error updating bookmark:', error);
                    showNotification(failureMessage, 'red');
                });
        });

        document.getElementById(`pdf-container-sem${Sem}`).appendChild(li);
    });
};

// Function to display notifications
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

// Initial setup
getUser().then(user => {
    console.log('User data:', user);
    // Initialize any UI or logic that depends on user data here
});
