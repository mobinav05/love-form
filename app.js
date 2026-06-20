const questionEl = document.getElementById("question");
const answerContainer = document.getElementById("answerContainer");
const stepCounter = document.getElementById("stepCounter");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentStep = 0;

// ذخیره همه جواب‌ها
const formData = {
    answers: []
};

// 🔥 ارسال به Google Sheet
function sendToSheet(data){

    fetch("https://script.google.com/macros/s/AKfycbwj_7Y9QQTJ2HcRmQKFGc7uFstzwCwFGqi2g6YO-9zv0qh_ZSMlRbvvSwXIrdOiqTLYHQ/exec", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

// ذخیره + ارسال
function saveAnswer(answer){

    const data = {
        step: currentStep,
        answer: answer,
        time: new Date().toISOString()
    };

    formData.answers.push(data);

    sendToSheet(data);
}

// مراحل
const steps = [
{
    question: "سلام 😊 یه چندتا سوال دارم...",
    type: "start",
    options: ["بپرس 😌"]
},
{
    question: "آخر هفته میای بریم تئاتر؟",
    type: "haveto"
},
{
    question: "حالا میشه دوستمو پارتنرشم بیان؟؟",
    type: "choice",
    options: ["اوکیه بیان", "نه خودمون بریم"]
},
{
    question: "چه تایمی وقت داری؟",
    type: "input"
},
{
    question: "فقط بگو چقد دوستم داری؟",
    type: "final"
}
];

// رندر
function renderStep(){

    const step = steps[currentStep];

    stepCounter.innerText = `مرحله ${currentStep + 1}`;
    questionEl.innerText = step.question;
    answerContainer.innerHTML = "";

    nextBtn.style.display = "none";
    prevBtn.style.display = "none";

    // START
    if(step.type === "start"){

        const btn = document.createElement("button");
        btn.innerText = step.options[0];

        btn.onclick = () => {
            saveAnswer(step.options[0]);
            nextStep();
        };

        answerContainer.appendChild(btn);
    }

    // HAVETO
    else if(step.type === "haveto"){

        const yes = document.createElement("button");
        yes.innerText = "حتما";

        const no = document.createElement("button");
        no.innerText = "نه خیر";

        yes.onclick = () => {
            saveAnswer("حتما");
            nextStep();
        };

        no.onclick = () => {
            saveAnswer("نه خیر");
            alert("نه خیر نداریم 😒");
        };

        answerContainer.appendChild(yes);
        answerContainer.appendChild(no);
    }

    // CHOICE
    else if(step.type === "choice"){

        step.options.forEach(opt => {

            const btn = document.createElement("button");
            btn.innerText = opt;

            btn.onclick = () => {
                saveAnswer(opt);
                nextStep();
            };

            answerContainer.appendChild(btn);
        });
    }

    // INPUT
    else if(step.type === "input"){

        answerContainer.innerHTML = `
            <input id="inputField" placeholder="روزشو بگو">
        `;

        nextBtn.style.display = "inline-block";
        prevBtn.style.display = "inline-block";
    }

    // FINAL
    else if(step.type === "final"){

        nextBtn.style.display = "none";
        prevBtn.style.display = "none";

        const yes = document.createElement("button");
        yes.innerText = "❤️ خیلی";

        const no = document.createElement("button");
        no.innerText = "❌ اصلا";

        yes.onclick = () => {
            saveAnswer("خیلی");
            finish();
        };

        no.onmouseover = () => {
            no.style.transform =
                `translate(${Math.random()*200-100}px,${Math.random()*200-100}px)`;
        };

        answerContainer.appendChild(yes);
        answerContainer.appendChild(no);
    }
}

// مرحله بعد
function nextStep(){

    const step = steps[currentStep];

    if(step.type === "input"){
        const input = document.getElementById("inputField");
        saveAnswer(input.value);
    }

    if(currentStep < steps.length - 1){
        currentStep++;
        renderStep();
    }
}

// مرحله قبل
function prevStep(){
    if(currentStep > 0){
        currentStep--;
        renderStep();
    }
}

// پایان (هیچی نشون نمی‌ده!)
function finish(){

    answerContainer.innerHTML = "";

    questionEl.innerHTML = `
        ❤️ ممنون 😊
        <br><br>
        فرم با موفقیت ثبت شد.
    `;

    stepCounter.innerText = "";

    nextBtn.style.display = "none";
    prevBtn.style.display = "none";

    console.log("RESULT:", formData.answers);
}

// events
nextBtn.onclick = nextStep;
prevBtn.onclick = prevStep;

renderStep();