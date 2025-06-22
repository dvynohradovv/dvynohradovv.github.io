document.addEventListener("DOMContentLoaded",()=>{const h=document.getElementById("history"),n=document.getElementById("command-input"),a=document.getElementById("terminal-body");if(!h||!n||!a)return;const l=[];let i=0,r=[],d=0;const g=(e,s)=>{if(!e){s&&s();return}const o=document.createElement("div");if(o.innerHTML=`<span class="text-green-400">visitor@dvynohradov:~$</span><span class="ml-2">${e}</span>`,h.appendChild(o),l.push(e),i=l.length,e==="clear")h.innerHTML="",s&&s();else if(u[e]){const t=document.createElement("div");t.className="mb-4",h.appendChild(t);const c=typeof u[e]=="function"?u[e]():u[e];v(t,c,s)}else{const t=document.createElement("div");t.className="mb-4",h.appendChild(t),v(t,`bash: command not found: ${e}`,s)}a.scrollTop=a.scrollHeight},p={help:`
      <p>Here are the available commands (o_o):</p>
      <p><span class="text-green-400">about</span> - Who I am</p>
      <p><span class="text-green-400">skills</span> - My technical skills</p>
      <p><span class="text-green-400">experience</span> - My work experience</p>
      <p><span class="text-green-400">philosophy</span> - My development philosophy</p>
      <p><span class="text-green-400">contact</span> - How to reach me</p>
      <p><span class="text-green-400">date</span> - Display the current date</p>
      <p><span class="text-green-400">clear</span> - Clear the terminal screen</p>
    `,about:`
      <p>I'm a Full-Stack Software Engineer who thrives on building complex, mission-critical systems. 🚀 Currently, I'm engineering the core platform that powers the law-making process for U.S. state governments. I handle the full stack, from Python backend services (Django, GraphQL) to React-based web apps and even some C#/.NET plugins for Microsoft Office. It's pretty cool stuff! (⌐■_■)b</p>
    `,skills:`
      <p>Here's my tech toolbox 🧰: (＾▽＾)/</p>
      <p><strong>Backend:</strong> Python (Django, GraphQL), Node.js, C#/.NET</p>
      <p><strong>Frontend:</strong> React, Next.js, JavaScript (ES6+), TypeScript, Astro, Tailwind CSS</p>
      <p><strong>Databases:</strong> PostgreSQL, MongoDB, Elasticsearch, Redis</p>
      <p><strong>DevOps:</strong> AWS, Jenkins, Docker, GitHub Workflows, CI/CD</p>
    `,experience:`
      <p>I've ventured through diverse domains like fintech, where I automated financial data processing, and B2B compliance platforms. 🏦 My experience has taught me that robust systems are built on a solid foundation. I'm all about that clean, maintainable code (SOLID principles!), fully automated CI/CD pipelines with Docker, and using the right data tools for the job, like PostgreSQL, Elasticsearch, and Redis. It's all about building things that last! (▀̿Ĺ̯▀̿ ̿)</p>
    `,philosophy:`
      <p>I'm a firm believer that the best products come from strong, collaborative teams. 🤝 I love participating in code reviews, sharing knowledge, and mentoring junior developers. I think a team's collective growth is the secret sauce to an amazing final product. I'm on the lookout for a new challenge where I can tackle tough technical problems in a place that values engineering excellence. ✨ Let's build something great together! (づ｡◕‿‿◕｡)づ</p>
    `,contact:`
      <p>You can reach me here: (☞ﾟヮﾟ)☞</p>
      <div class="flex justify-center space-x-4 mt-4">
        <a href="mailto:dvynohradovv@proton.me" class="bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-envelope w-4 h-4 ml-2"></i>
          <span>Email</span>
        </a>
        <a href="https://www.linkedin.com/in/dvynohradov/" target="_blank" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fab fa-linkedin w-4 h-4 ml-2"></i>
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/dvynohradovv" target="_blank" class="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fab fa-github w-4 h-4 ml-2"></i>
          <span>GitHub</span>
        </a>
        <a href="https://t.me/dvynohradov" target="_blank" class="bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fab fa-telegram w-4 h-4 ml-2"></i>
          <span>Telegram</span>
        </a>
      </div>
    `},u={clear:"",help:p.help,about:p.about,skills:p.skills,experience:p.experience,philosophy:p.philosophy,contact:p.contact,date:()=>new Date().toDateString()},v=(e,s,o)=>{let t=0;e.innerHTML="";const c=()=>{if(t<s.length){const f=s.charAt(t);if(f==="<"){const m=s.indexOf(">",t);m!==-1?(e.innerHTML+=s.substring(t,m+1),t=m+1):(e.innerHTML+=f,t++)}else e.innerHTML+=f,t++;a.scrollTop=a.scrollHeight,setTimeout(c,10)}else o&&o()};c()};n.addEventListener("keydown",e=>{const s=e.key==="Tab",o=e.key==="ArrowUp"||e.key==="ArrowDown";if(!s&&!o&&(r=[],d=0),s){e.preventDefault();const t=n.value.toLowerCase();r.length===0&&(r=Object.keys(u).filter(c=>c.startsWith(t)),d=0),r.length>0&&(n.value=r[d],d=(d+1)%r.length,n.dispatchEvent(new Event("input")))}else if(e.key==="Enter"){e.preventDefault();const t=n.value.trim().toLowerCase();t&&g(t),n.value="",n.dispatchEvent(new Event("input")),a.scrollTop=a.scrollHeight}else e.key==="ArrowUp"?(e.preventDefault(),i>0&&(i--,n.value=l[i],n.dispatchEvent(new Event("input")))):e.key==="ArrowDown"&&(e.preventDefault(),i<l.length-1?(i++,n.value=l[i],n.dispatchEvent(new Event("input"))):(i=l.length,n.value="",n.dispatchEvent(new Event("input"))))}),n.addEventListener("input",()=>{const s=Math.max(1,n.value.length);n.style.width=`${s}ch`}),n.style.width="1ch",a.addEventListener("click",()=>{n.focus()}),g("about",()=>{g("skills",()=>{g("contact")})})});
