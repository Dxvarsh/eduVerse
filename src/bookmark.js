const loginSection = document.getElementById('log-in-section');
const profile = document.getElementById('profile-section');
const bookmarks = document.getElementById('bookmark-section');
const bookmarksDocs = document.getElementById('bookmarks-docs');
let currentUser;
window.addEventListener('load', () => {
    fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/login", {
        method: 'POST',
        credentials: 'include',
        // body: JSON.stringify({"username":username,"password":password})
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json(); // assuming response is JSON
    })
    .then((data) => {
        console.log(data); // assuming response data
        // Assuming you get some data indicating successful login

        loginSection.classList.add('hidden');
        return fetch('https://kirtanmojidra.pythonanywhere.com/api/v1/getuser', {
            method: 'GET',
            credentials: 'include'
        });
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch user information');
        }
        return res.json(); // assuming response is JSON
    })
    .then((userData) => {
        profile.classList.remove('hidden');
        bookmarks.classList.remove('hidden');
        currentUser = userData.data;
        console.log(currentUser); // Handle user data as needed
        // Update UI or perform actions based on user data
        profile.innerHTML = `
            <div id="profile" class="flex relative">

                    <div class="profile-pic w-16 h-16 rounded-full overflow-hidden border border-darkblue border-dashed relative mr-3 flex items-center justify-center">
                        <img width="60" height="60" src="https://img.icons8.com/dotty/80/test-account.png" alt="test-account"/>
                    </div>


                   <div class="profile-info">
                    <h1 class="text-2xl font-semibold">${userData.data.fullname}</h1>
                    <p class="text-lg">@${userData.data.username}</p>
                   </div>

                   <div id="log-out" class="absolute -right-2 -top-1 flex items-center">
                        <button class="text-white px-2 py-1 md:px-6 md:py-2 border border-red-500 rounded-md bg-red-500 hover:rounded-xl transition-all" id="logout">
                            <span class="hidden md:block">Logout</span>
                            <i class="ri-shut-down-line text-xl md:hidden"></i>
                        </button>
                   </div>
                </div>
        `;

        document.getElementById('logout').addEventListener('click',(e) =>{
            console.log("logout clicked");
            fetch('https://kirtanmojidra.pythonanywhere.com/api/v1/logout', {
                method: 'POST',
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
                // Handle successful logout, e.g., redirect to login page, update UI, etc.
                window.location.replace('./login.html');
            })
            .catch(error => {
                console.error('Error logging out:', error);
                // Handle error, display error message, etc.
            });
        })
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/bookmarks`, {
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
            console.log('Bookmarks:', data.data);
            saariPdf(data.data);
            // Handle the bookmarks data as needed
        })
        .catch(error => {
            console.error('Error fetching bookmarks:', error);
            // Handle error, display an error message, etc.
        });
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors here, such as displaying an error message
    });

});


const showKaro = (book, index) => {
    let li = document.createElement("li");
    console.log(book);
    const {
        title,
        username,
        date,
        path,
        sem
    } = book;
    console.log(currentUser);
    console.log(title, username, date, path, sem);
    
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

                    
                    <a href="https://kirtanmojidra.pythonanywhere.com/api/v1/deletepdf/${path}" class=${currentUser.isadmin ? "block" : "hidden"}>
                        <button class=" text-white text-xl font-bold rounded-full hover:bg-tailblue px-2 py-2 dlt-btn" id="${path}">
                            <i class="ri-delete-bin-line text-red-400"></i>
                        </button>
                    </a>
                    <button class=" text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-2 bookmark-btn" id="${path}">
                        <i class="ri-bookmark-fill" id="${path}"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    li.querySelector('.bookmark-btn').addEventListener('click',(e)=>{
        const path = e.target.id; // Assuming id is set properly as path
        console.log(path);
        fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/deletebookmark/${path}`, {
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
            console.log('Bookmark added successfully:', data);
            // Handle success, update UI if needed
            document.querySelector("#notification").innerHTML = `
                <div class="w-[80%] md:w-fit p-8 rounded-lg bg-green-300">
                    <h2 class="text-2xl font-semibold">✅ Bookmark removed</h2>
                </div>`;
            document.querySelector("#notification").style.top = "100px";
            document.querySelector("#notification").style.opacity = 1;
            setTimeout(function () {
                document.querySelector("#notification").style.top = "12px";
                document.querySelector("#notification").style.opacity = 0;
              }, 5000);
        })
        .catch(error => {
            console.error('Error adding bookmark:', error);
            document.querySelector("#notification").innerHTML = `
                <div class="w-[80%] md:w-fit p-8 rounded-lg bg-red-300">
                    <h2 class="text-2xl font-semibold">🚫${error}</h2>
                </div>
            
            `;
            document.querySelector("#notification").style.top = "100px";
            document.querySelector("#notification").style.opacity = 1;
            setTimeout(function () {
                document.querySelector("#notification").style.top = "12px";
                document.querySelector("#notification").style.opacity = 0;
            }, 5000);
            // Handle error, display error message or retry logic
        });
    })
    document.getElementById(`bookmark-docs`).appendChild(li);
}


const saariPdf = (pdf) =>{
    pdf.forEach((book, index) => {
        showKaro(book, index);
    });
}
