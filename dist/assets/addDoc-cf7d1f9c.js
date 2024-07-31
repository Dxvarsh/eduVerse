import"./modulepreload-polyfill-3cfb730f.js";/* empty css             */const i=document.querySelector("#add-doc-form"),u=document.querySelector("#vid"),m=document.querySelectorAll('input[type="radio"]');document.querySelectorAll("select");const p=document.querySelector("#pdf-name"),y=document.querySelector("#file-input");let r,a;const l=document.querySelector(".loader-main"),c=document.querySelector("main"),o=document.querySelector("#yes");m.forEach(s=>{s.addEventListener("change",d=>{const n=d.target.value;r=n;const e=document.getElementById(`subject-${n}`);e&&e.addEventListener("change",function(t){a=t.target.value})})});i.addEventListener("submit",async s=>{s.preventDefault(),l.classList.remove("hidden"),c.classList.add("hidden");const d=p.value.trim(),n=y.files[0],e=new FormData;e.append("pdf",n),e.append("subject",a),e.append("sem",r),e.append("title",d);try{const t=await fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/upload",{method:"POST",credentials:"include",body:e});t.ok?(o.innerHTML=`
        <div class="w-full md:w-fit p-8 rounded-lg bg-green-300">
          <h2 class="text-2xl font-semibold">✅ ${d} added Successfully</h2>
        </div>  
      `,document.querySelector("#video").style.opacity=1,document.querySelector("#video").style.bottom="75px",u.play()):o.innerHTML=`
        <div class="w-full md:w-fit p-8 rounded-lg bg-red-300">
          <h2 class="text-2xl font-semibold">🚫 ${t.statusText} user, Please login and try again later.</h2>
        </div>`}catch(t){console.error("Error:",t),o.innerHTML=`
      <div class="w-full md:w-fit p-8 rounded-lg bg-red-300">
        <h2 class="text-2xl font-semibold">🚫 ${t.message}</h2>
      </div>`}finally{l.classList.add("hidden"),c.classList.remove("hidden"),o.style.top="25px",o.style.opacity=1,setTimeout(()=>{o.style.top="12px",o.style.opacity=0},7e3),setTimeout(()=>{document.querySelector("#video").style.opacity=0,window.location.replace("./home.html")},13e3)}});
