import"./modulepreload-polyfill-3cfb730f.js";/* empty css             */const i=document.getElementById("log-in-section"),a=document.getElementById("profile-section"),g=document.getElementById("bookmark-section");document.getElementById("bookmarks-docs");const c=document.querySelector(".loader-main"),m=document.querySelector("main");c.classList.remove("hidden");m.classList.add("hidden");const w=()=>{fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/getuser",{method:"GET",credentials:"include"}).then(e=>{if(!e.ok)throw console.log(e),new Error(e.status);return e.json()}).then(e=>{if(console.log(e),e.status_code>200)console.log(e.status_code),r(user.message,"red");else if(e.status_code===200)return console.log(e.status_code),e.data}).then(e=>{console.log("user"),console.log("User data:",e),c.classList.add("hidden"),m.classList.remove("hidden"),a.classList.remove("hidden"),g.classList.remove("hidden"),a.innerHTML=`
            <div id="profile" class="flex relative">
                <div class="profile-pic w-16 h-16 rounded-full overflow-hidden border border-darkblue border-dashed relative mr-3 flex items-center justify-center">
                    <img width="60" height="60" src="https://img.icons8.com/dotty/80/test-account.png" alt="test-account"/>
                </div>
                <div class="profile-info">
                    <h1 class="text-2xl font-semibold">${e.fullname}</h1>
                    <p class="text-lg">@${e.username}</p>
                </div>
                <div id="log-out" class="absolute -right-2 -top-1 flex items-center">
                    <button class="text-white px-2 py-1 md:px-6 md:py-2 border border-red-500 rounded-md bg-red-500 hover:rounded-xl transition-all" id="logout">
                        <span class="hidden md:block">Logout</span>
                        <i class="ri-shut-down-line text-xl md:hidden"></i>
                    </button>
                </div>
            </div>
        `,document.getElementById("logout").addEventListener("click",()=>{confirm("Are you sure want to log out?")&&fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/logout",{method:"GET",credentials:"include"}).then(o=>{if(!o.ok)throw console.log(o),new Error("Logout request failed");return o.json()}).then(o=>{console.log("Logout successful:",o),i.classList.remove("hidden"),i.innerHTML=`
                        <div class="w-fit md:w-fit p-8 rounded-lg bg-red-300">
                            <h2 class="text-2xl font-semibold">🚫Abhi bhi time hai log in kr le🥲</h2>
                            <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="refresh">Log in</button>
                            <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="home">Nahi karuga</button>
                        </div>
                    `,a.classList.add("hidden"),g.classList.add("hidden"),document.querySelector("#refresh").addEventListener("click",()=>{window.location.replace("./login.html")}),document.querySelector("#home").addEventListener("click",()=>{window.location.replace("./home.html")})}).catch(o=>{console.error("Error logging out:",o),r("Error while logging out","red")})}),fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/bookmarks",{method:"GET",credentials:"include"}).then(o=>{if(!o.ok)throw console.log(o),new Error("Failed to fetch bookmarks");return o.json()}).then(o=>{console.log(o),b(o.data,e)}).catch(o=>{console.error("Error fetching bookmarks:",o)})}).catch(e=>{console.error("Error:",e),c.classList.add("hidden"),m.classList.remove("hidden"),i.classList.remove("hidden"),i.innerHTML=`
            <div class="w-fit md:w-fit p-8 rounded-lg bg-red-300">
                <h2 class="text-2xl font-semibold">🚫${e} You are not Logged in.</h2>
                <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="refresh">Log in</button>
                <button class="mt-5 px-5 py-1 rounded bg-red-500 font-bold" id="home">Back</button>
            </div>
        `,document.querySelector("#refresh").addEventListener("click",()=>{window.location.replace("./login.html")}),document.querySelector("#home").addEventListener("click",()=>{window.location.replace("./home.html")})})};w();const v=(e,o=0)=>{console.log(e);const{title:t,username:h,date:u,path:l,sem:f}=e;console.log(o),console.log(t,h,u,l,f);const s=document.createElement("li");s.innerHTML=`
        <div class="theory mb-2">
            <div class="w-full rounded overflow-hidden shadow-lg bg-gray-800 text-white md:flex">
                <div class="p-4 md:w-[70%]">
                    <div class="font-bold text-xl mb-2 tracking-wider">${t}</div>
                    <p class="text-gray-300 text-base">Provided by <span class="text-tailblue tracking-wider">${h}</span> on <span class="text-tailblue tracking-wider">${u}</span>.
                    </p>
                </div>
                <div class="px-4 pb-4 flex justify-between items-center md:w-[30%]">
                    <a href="https://kirtanmojidra.pythonanywhere.com/api/v1/pdf/${l}" download="${t} eduVerse" id="download-btn">
                        <button class="text-white font-bold py-2 px-4 rounded-full tracking-wide bg-tailblue hover:bg-transparent border border-tailblue transition-colors">
                            <i class="ri-download-line mr-2"></i> Download
                        </button>
                    </a>
                    
                    
                    <button class="text-white text-2xl font-bold rounded-full hover:bg-tailblue px-2 py-2 bookmark-btn" id="${l}">
                        <i class="ri-bookmark-fill" id="${l}"></i>
                    </button>
                </div>
            </div>
        </div>`,s.querySelector(".bookmark-btn").addEventListener("click",p=>{const k=p.target.id;fetch(`https://kirtanmojidra.pythonanywhere.com/api/v1/deletebookmark/${k}`,{method:"GET",credentials:"include"}).then(d=>{if(!d.ok)throw console.log(d),new Error("Bookmark API request failed");return d.json()}).then(d=>{console.log("Bookmark removed successfully:",d),r("Bookmark removed successfully","green"),fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/bookmarks",{method:"GET",credentials:"include"}).then(n=>{if(!n.ok)throw console.log(n),new Error("Bookmark API request failed");return n.json()}).then(n=>{console.log(n),document.getElementById("bookmark-docs").innerHTML="",b(n.data,o)}).catch(n=>{console.error("Error adding bookmark:",n),r("Failed to bookmark PDF","red")})}).catch(d=>{console.error("Error adding bookmark:",d)})}),document.getElementById("bookmark-docs").appendChild(s)},b=(e,o)=>{console.log(e,"--hello"),e.forEach(t=>{console.log(t),v(t,o)})},r=(e,o)=>{const t=document.querySelector("#notification");t.innerHTML=`
        <div class="w-[100%] md:w-[80%] p-8 rounded-lg bg-${o}-300">
            <h2 class="text-2xl font-semibold">${e}</h2>
        </div>`,t.style.top="100px",t.style.opacity=1,setTimeout(()=>{t.style.top="12px",t.style.opacity=0},5e3)};
