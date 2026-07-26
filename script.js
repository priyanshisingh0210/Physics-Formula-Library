const history = [];
const undoStack = [];
const redoQueue = [];

function renderInputs() {
    const sel = document.getElementById('formulaSelect').value;
    const container = document.getElementById('inputs');

    container.innerHTML = '';

    const makeInput = (id, label) => {

        const lbl = document.createElement('label');
        lbl.textContent = label;
        lbl.htmlFor = id;

        const inp = document.createElement('input');
        inp.type = 'number';
        inp.id = id;
        inp.step = 'any';

        container.appendChild(lbl);
        container.appendChild(inp);
    };

    if (sel === 'final_velocity') {
        makeInput('u', 'u (initial velocity)');
        makeInput('a', 'a (acceleration)');
        makeInput('t', 't (time)');
    }

    if (sel === 'displacement') {
        makeInput('u', 'u (initial velocity)');
        makeInput('a', 'a (acceleration)');
        makeInput('t', 't (time)');
    }

    if (sel === 'force') {
        makeInput('m', 'm (mass)');
        makeInput('a', 'a (acceleration)');
    }

    if (sel === 'kinetic_energy') {
        makeInput('m', 'm (mass)');
        makeInput('v', 'v (velocity)');
    }

    if (sel === 'voltage') {
        makeInput('I', 'I (current)');
        makeInput('R', 'R (resistance)');
    }
}

function pushHistory(label, value) {
    history.unshift({ label, value });
    redoQueue.length = 0;
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';

    if (history.length === 0) {
        list.innerHTML = '<div class="small">No history yet.</div>';
        return;
    }

    history.forEach(item => {

        const div = document.createElement('div');

        div.className = 'history-item';

        div.innerHTML = `<div><strong>${item.label}</strong></div>
                         <div class="small">= ${Number(item.value).toFixed(2)}</div>`;

        list.appendChild(div);
    });
}

function undo() {

    if (history.length === 0) {
        alert("Nothing to undo!");
        return;
    }

    const undone = history.shift();

    undoStack.push(undone);

    redoQueue.push({
        label: undone.label,
        value: undone.value
    });

    renderHistory();

    alert(`Undid: ${undone.label} = ${Number(undone.value).toFixed(2)}`);
}

function redo() {

    if (redoQueue.length === 0) {
        alert("Nothing to redo!");
        return;
    }

    const redone = redoQueue.shift();

    pushHistory(redone.label, redone.value);

    alert(`Redid: ${redone.label} = ${Number(redone.value).toFixed(2)}`);
}

function final_velocity(u,a,t){
    return Number(u)+Number(a)*Number(t);
}

function displacement(u,a,t){
    return Number(u)*Number(t)+0.5*Number(a)*Number(t)*Number(t);
}

function force(m,a){
    return Number(m)*Number(a);
}

function kinetic_energy(m,v){
    return 0.5*Number(m)*Number(v)*Number(v);
}

function voltage(I,R){
    return Number(I)*Number(R);
}

document.getElementById("formulaSelect").addEventListener("change",renderInputs);

document.getElementById("calcBtn").addEventListener("click",()=>{

    const sel=document.getElementById("formulaSelect").value;

    let res,label;

    try{

        if(sel==="final_velocity"){
            const u=+document.getElementById("u").value;
            const a=+document.getElementById("a").value;
            const t=+document.getElementById("t").value;

            res=final_velocity(u,a,t);

            label=`Final Velocity (u=${u}, a=${a}, t=${t})`;
        }

        if(sel==="displacement"){
            const u=+document.getElementById("u").value;
            const a=+document.getElementById("a").value;
            const t=+document.getElementById("t").value;

            res=displacement(u,a,t);

            label=`Displacement (u=${u}, a=${a}, t=${t})`;
        }

        if(sel==="force"){
            const m=+document.getElementById("m").value;
            const a=+document.getElementById("a").value;

            res=force(m,a);

            label=`Force (m=${m}, a=${a})`;
        }

        if(sel==="kinetic_energy"){
            const m=+document.getElementById("m").value;
            const v=+document.getElementById("v").value;

            res=kinetic_energy(m,v);

            label=`Kinetic Energy (m=${m}, v=${v})`;
        }

        if(sel==="voltage"){
            const I=+document.getElementById("I").value;
            const R=+document.getElementById("R").value;

            res=voltage(I,R);

            label=`Voltage (I=${I}, R=${R})`;
        }

    }catch(e){

        alert("Please fill inputs correctly.");
        return;
    }

    if(isNaN(res)){
        alert("Result is not a number — check inputs.");
        return;
    }

    document.getElementById("result").textContent=`Result: ${res.toFixed(2)}`;

    pushHistory(label,res);

});

document.getElementById("clearBtn").addEventListener("click",()=>{

    document.getElementById("result").textContent="";

    renderInputs();

});

document.getElementById("undoBtn").addEventListener("click",undo);

document.getElementById("redoBtn").addEventListener("click",redo);

document.getElementById("clearHistoryBtn").addEventListener("click",()=>{

    if(confirm("Clear history?")){

        history.length=0;
        undoStack.length=0;
        redoQueue.length=0;

        renderHistory();
    }

});

renderInputs();
renderHistory();