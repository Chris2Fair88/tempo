function t(t,a="success",n=2500){try{const e={id:Date.now()+Math.random(),message:t,variant:a,duration:n};window.dispatchEvent(new CustomEvent("tempo:toast",{detail:e}))}catch(e){}}export{t};
