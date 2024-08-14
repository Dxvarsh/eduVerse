// DOM elements
const loginSection = document.getElementById('log-in-section');
const profile = document.getElementById('profile-section');
const bookmarks = document.getElementById('bookmark-section');
const bookmarksDocs = document.getElementById('bookmarks-docs');
const loader = document.querySelector(".loader-main");
const main = document.querySelector("main");

// Show loader and hide main content
loader.classList.remove("hidden");
main.classList.add("hidden");

const getUser = () => {
    fetch('https://eduversebackend-hd6t.onrender.com/api/v1/getuser', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(res => {
        if (res.status_code !== 200) {
            showNotification(res.message || 'An error occurred', 'red');
            throw new Error(res.message || 'Unknown error');
        }
        return res.data;
    })
    .then(currentUser => {
        // Update UI for logged-in user
        loader.classList.add("hidden");
        main.classList.remove("hidden");
        profile.classList.remove('hidden');
        bookmarks.classList.remove('hidden');

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
            </div>
        `;

        // Attach logout button event listener
        document.getElementById('logout').addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
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
                .then(() => {
                    loginSection.classList.remove('hidden');
                    loginSection.innerHTML = `
                        <div class="w-fit md:w-fit p-8 rounded-lg bg-red-300">
                            <h2 class="text-2xl font-semibold">🚫Abhi bhi time hai log in kr le🥲</h2>
                            <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="refresh">Log in</button>
                            <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="home">Nahi karunga</button>
                        </div>
                    `;
                    profile.classList.add('hidden');
                    bookmarks.classList.add('hidden');
                    document.getElementById('refresh').addEventListener('click', () => window.location.replace('./login.html'));
                    document.getElementById('home').addEventListener('click', () => window.location.replace('./home.html'));
                })
                .catch(error => {
                    showNotification('Error while logging out', 'red');
                    console.error('Error logging out:', error);
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
            saariPdf(data.data, currentUser);
        })
        .catch(error => {
            showNotification('Failed to fetch bookmarks', 'red');
            console.error('Error fetching bookmarks:', error);
        });
    })
    .catch(error => {
        loader.classList.add("hidden");
        main.classList.remove("hidden");
        loginSection.classList.remove('hidden');
        loginSection.innerHTML = `
            <div class="w-fit md:w-fit p-8 rounded-lg bg-red-300">
                <h2 class="text-2xl font-semibold">🚫You are not Logged in.</h2>
                <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="refresh">Log in</button>
                <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="home">Back</button>
            </div>
        `;
        document.getElementById('refresh').addEventListener('click', () => window.location.replace('./login.html'));
        document.getElementById('home').addEventListener('click', () => window.location.replace('./home.html'));
        console.error('Error:', error);
    });
};

const showKaro = (book, currentUser = {}) => {
    const { title, username, date, path, sem, subject } = book;
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="theory mb-2">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex relative">
                <div class="p-4 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                    <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${username}</span> on <span class="text-tailblue tracking-wider">${date}</span>.</p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="https://eduversebackend-hd6t.onrender.com/api/v1/pdf/${path}" id="download-btn">
                        <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-[#38bdf8] hover:bg-transparent border border-tailblue transition-colors">
                            <i class="ri-download-line mr-2"></i> Download
                        </button>
                    </a>
                    <button class="text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-1.5 bookmark-btn">
                        <i class="ri-bookmark-fill" id="${path}"></i>
                    </button>
                </div>
                <p class="rounded-full px-2 py-1 text-gray-300 text-xs absolute bg-slate-900 top-1 right-1 md:right-1/2">Document Location: <span class="text-tailblue tracking-wider">Sem: ${sem}, ${subject}</span>.</p>
            </div>
        </div>`;
    
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
        .then(() => {
            showNotification('Bookmark removed successfully', 'green');
            const bookIdTag = document.getElementById(path);
            const parentLi = bookIdTag.closest('li');
            if (parentLi) {
                parentLi.remove();
            }
        })
        .catch(error => {
            console.error('Error handling bookmark:', error);
        });
    });

    bookmarksDocs.appendChild(li);
};

const saariPdf = (pdfs, currentUser) => {
    pdfs.forEach(book => showKaro(book, currentUser));
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

// Start the user fetch process
getUser();
