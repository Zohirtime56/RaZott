// ملف: earn/script.js

let currentUser = null;

async function initEarnPage() {
    // التأكد من الاتصال
    if (!window.sb) {
        setTimeout(initEarnPage, 500);
        return;
    }

    const { data } = await window.sb.auth.getSession();
    if (!data.session) {
        window.location.href = "../index.html";
        return;
    }
    
    currentUser = data.session.user;
    updateBalanceDisplay();
}

// دالة تحديث الرصيد المعروض
async function updateBalanceDisplay() {
    const { data: profile } = await window.sb.from('profiles').select('balance').eq('id', currentUser.id).single();
    if (profile) {
        document.getElementById('current-balance').innerText = profile.balance.toFixed(4);
    }
}

// --- منطق مشاهدة الإعلان ---
function startAd(companyName, rewardAmount) {
    const overlay = document.getElementById('ad-overlay');
    const timerEl = document.getElementById('timer');
    
    overlay.style.display = 'flex'; // إظهار الشاشة
    let timeLeft = 5; // مدة الإعلان (5 ثواني)
    timerEl.innerText = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(interval);
            completeAd(rewardAmount);
        }
    }, 1000);
}

// دالة إضافة المكافأة عند انتهاء الوقت
async function completeAd(amount) {
    document.getElementById('timer').innerText = "✔";
    
    try {
        // 1. جلب الرصيد القديم
        const { data: profile } = await window.sb.from('profiles').select('balance').eq('id', currentUser.id).single();
        
        // 2. حساب الرصيد الجديد
        const newBalance = profile.balance + amount;
        
        // 3. التحديث في قاعدة البيانات
        await window.sb.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);
        
        // 4. إغلاق الإعلان وتحديث الشاشة
        setTimeout(() => {
            document.getElementById('ad-overlay').style.display = 'none';
            updateBalanceDisplay();
            alert(`✅ مبروك! تم إضافة ${amount} $ لرصيدك.`);
        }, 500);

    } catch (err) {
        alert("حدث خطأ في الشبكة: " + err.message);
        document.getElementById('ad-overlay').style.display = 'none';
    }
}

// تشغيل الصفحة
initEarnPage();
