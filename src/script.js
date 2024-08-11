// DOM elements
const loader = document.querySelector(".loader-main");
const main = document.querySelector("main");
const greet = document.getElementById("greeting");
const loginbtn2 = document.getElementById("log-in-btn2")


window.addEventListener("scroll",function(){
    const practicalPopups = document.querySelectorAll('#practical-popup');
    
    practicalPopups.forEach(popup => {
        popup.classList.toggle("-bottom-16", window.scrollY > 0);
    });
})

// Function to fetch user information
const getUser = () => {
    loader.classList.remove("hidden");
    main.classList.add("hidden");
    return fetch('https://eduversebackend-hd6t.onrender.com/api/v1/getuser', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            // throw new Error('Failed to fetch user information');
            console.log("failed to fetch user information");
        }
        return response.json();
    })
    .then(user => {
        loader.classList.add("hidden");
        main.classList.remove("hidden");
        if (user.status_code > 200) {
            console.log(user.status_code);
            throw new Error(user.status_code);
        } else {
            loginbtn2.classList.add('hidden');
            console.log(user);
            sayHello(user.data.fullname);
            return user.data; // Assuming user.data contains the user information
        }
    });
};


const radioButtons = document.querySelectorAll('input[type="radio"]');
const semContainers = document.querySelectorAll('.container');
const backbtn = document.querySelectorAll('#back-btn')

backbtn.forEach(back => {
    back.addEventListener('click', ()=>{
        location.reload();
    })
})

radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedValue = radio.value;
        semContainers.forEach(container => {
            if (container.id === `container-sem${selectedValue}`) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
        
        const semSelection = document.getElementById('sem-selection'); 
        semSelection.style.display = 'none';
        document.getElementById('greet-area').style.display = 'none';
        
        // Fetch PDFs based on semester and subject
        const subjects = document.querySelectorAll('select');
        subjects.forEach(sub => {
            sub.addEventListener('change', (e) => {
                const selectedSubject = e.target.value;
                console.log(`Subject ${selectedSubject}, sem ${selectedValue}`);
                selectKar(selectedValue, selectedSubject);
            });
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
            console.log(res.data);
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
    pdfs.forEach(pdf => {
        showKaro(pdf);
    });
};

// Function to display individual PDF item
const showKaro = (pdf) => {
    const {
        title,
        username,
        date,
        path,
        Sem,
        subject,
        isBookmarked
    } = pdf;

    console.log(pdf);
    

    let bookmark = true
    if(isBookmarked === 'false')
        bookmark = false
    getUser()
        .then(currentUser => {
            console.log(currentUser);
            console.log("hello");
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="theory mb-2">
                    <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                        <div class="p-4 md:w-[70%]">
                            <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                            <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${username}</span> on <span class="text-tailblue tracking-wider">${date}</span>.
                            </p>
                        </div>
                        <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                            <a href="https://eduversebackend-hd6t.onrender.com/api/v1/pdf/${path}" id="download-btn">
                                <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                                    <i class="ri-download-line mr-2"></i> Download
                                </button>
                            </a>
                            
                            <button class=" text-white text-xl font-bold rounded-full hover:bg-tailblue px-2 py-2 dlt-btn">
                                <i class="ri-delete-bin-line text-red-400" id="${path}"></i>
                            </button>
                            
                            <button class="text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-2 bookmark-btn" id="${path}">
                                <i class="${ bookmark ? "ri-bookmark-fill" : "ri-bookmark-line"}" id="${path}"></i>
                            </button>
                        </div>
                    </div>
                </div>`;

            li.querySelector('.dlt-btn').addEventListener('click', (e) => {
                const path = e.target.id;
                console.log(path);
                
                if (confirm("Are You sure Want to delete?")) {
                    fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/deletepdf/${path}`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        console.log(data);
                        
                        if(data.status_code == 200){
                            console.log(data);
                            showNotification('PDF deleted successfully', 'green');
                            setTimeout(() => {
                                selectKar(Sem, subject); // Refresh PDF list after deletion
                            }, 3000);
                        }else{
                            console.log("--responce")
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
                fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/bookmark/${path}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        throw new Error('Bookmark API request failed');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Bookmark added successfully:', data);
                    showNotification('PDF bookmarked', 'green');
                    setTimeout(() => {
                        selectKar(Sem, subject); // Refresh PDF list after deletion
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error adding bookmark:', error);
                    showNotification('Failed to bookmark PDF', 'red');
                });
            });

            document.getElementById(`pdf-container-sem${Sem}`).appendChild(li);
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            console.log("in catch");
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="theory mb-2">
                    <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                        <div class="p-4 md:w-[70%]">
                            <div class="font-bold text-xl mb-2 tracking-wider">${title}</div>
                            <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${username}</span> on <span class="text-tailblue tracking-wider">${date}</span>.
                            </p>
                        </div>
                        <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                            <a href="https://eduversebackend-hd6t.onrender.com/api/v1/pdf/${path}" download="${title} eduVerse" id="download-btn">
                                <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                                    <i class="ri-download-line mr-2"></i> Download
                                </button>
                            </a>
                            
                            <button class="text-white text-xl font-bold rounded-full hover:bg-tailblue px-2 py-2 dlt-btn">
                                <i class="ri-delete-bin-line text-red-400" id="${path}"></i>
                            </button>
                            
                            <button class="text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-2 bookmark-btn" id="${path}">
                                <i class="ri-bookmark-line" id="${path}"></i>
                            </button>
                        </div>
                    </div>
                </div>`;

            li.querySelector('.dlt-btn').addEventListener('click', (e) => {
                const path = e.target.id;
                if (confirm("Are You sure Want to delete?")) {
                    fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/deletepdf/${path}`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    .then(res => {
                        if (res.ok) {
                            console.log("--res");
                            return res.json();
                        } else {
                            console.log("--response--");
                            throw new Error('Failed to delete PDF');
                        }
                    })
                    .then(data => {
                        console.log(data);
                        showNotification('PDF deleted successfully', 'green');
                        setTimeout(() => {
                            selectKar(Sem, subject); // Refresh PDF list after deletion
                        }, 6000);
                    })
                    .catch(error => {
                        console.error('Error deleting PDF:', error);
                        showNotification('Failed to delete PDF', 'red');
                    });
                }
            });

            li.querySelector('.bookmark-btn').addEventListener('click', (e) => {
                const path = e.target.id;
                fetch(`https://eduversebackend-hd6t.onrender.com/api/v1/bookmark/${path}`, {
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
                    showNotification('PDF bookmarked', 'green');
                })
                .catch(error => {
                    console.error('Error adding bookmark:', error);
                    showNotification('Failed to bookmark PDF', 'red');
                });
            });

            document.getElementById(`pdf-container-sem${Sem}`).appendChild(li);
        });
};

// Function to display notifications
const showNotification = (message, color) => {
    const notification = document.querySelector("#notification");
    notification.innerHTML = `
        <div class="w-[100%] md:w-[80%] p-8 rounded-lg bg-${color}-300">
            <h2 class="text-2xl font-semibold">${message}</h2>
        </div>`;
    notification.style.top = "100px";
    notification.style.opacity = 1;

    setTimeout(() => {
        notification.style.top = "12px";
        notification.style.opacity = 0;
    }, 3000);
};

// Initial setup
getUser()
    .then(user => {
        loginbtn2.classList.add('hidden');

        console.log("user");
        console.log('User data:', user);
        // Example: Initialize any UI or logic that depends on user data here
    })
    .catch(error => {
        console.error('Error fetching user:', error);
        if(error == 'Error: 401'){
            sayHello();
        }
    });
function sayHello(user='Buddy'){
    greet.innerHTML = `
        <h1 class="text-white text-3xl font-monument">Hellow, <br><span class="text-tailblue">${user}</span>👋</h1>
    `;
}