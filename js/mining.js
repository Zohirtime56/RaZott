// ملف: js/mining.js
// هذا الملف مسؤول عن التعدين والحسابات

async function initMining() {
    const statusBox = document.getElementById('status-msg');
    
    // هل المكتبة جاهزة؟
    if (!window.sb) {
        statusBox.innerText = "⚠️ انتظر.. جاري تحميل الاتصال...";
        setTimeout(initMining, 1000); // حاول مرة أخرى بعد ثانية
        return;
    }

    try {
        // 1. التحقق من المستخدم
        const { data } = await window.sb.auth.getSession();
        if (!data.session) {
            window.location.href = "index.html"; // طرد
            return;
        }

        const user = data.session.user;
        document.getElementById('user-email').innerText = user.email;
        statusBox.style.display = 'none'; // إخفاء رسالة الانتظار
        document.getElementById('dashboard-content').style.display = 'block';

        // 2. جلب الرصيد
        await loadBalance(user.id);

        // 3. تشغيل العداد الوهمي
        setInterval(() => {
            let el = document.getElementById('pending');
            let current = parseFloat(el.innerText);
            el.innerText = (current + 0.00001).toFixed(5);
        }, 1000);

    } catch (err) {
        statusBox.innerText = "خطأ: " + err.message;
        statusBox.style.color = "red";
    }
}

async function loadBalance(userId) {
    const { data: profile, error } = await window.sb
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        // إنشاء مستخدم جديد
        await window.sb.from('profiles').insert([{ id: userId, username: 'user', balance: 0 }]);
        document.getElementById('balance').innerText = "0.0000";
    } else {
        document.getElementById('balance').innerText = profile.balance.toFixed(4);
    }
}

async function collectProfits() {
    const { data } = await window.sb.auth.getSession();
    const user = data.session.user;
    
    const pendingEl = document.getElementById('pending');
    const amount = parseFloat(pendingEl.innerText);

    if (amount <= 0) return alert("لا يوجد رصيد للجمع");

    const btn = document.getElementById('collectBtn');
    btn.innerText = "جاري الحفظ...";
    btn.disabled = true;

    // تحديث القاعدة
    const { data: profile } = await window.sb.from('profiles').select('balance').eq('id', user.id).single();
    const newBalance = profile.balance + amount;
    
    await window.sb.from('profiles').update({ balance: newBalance }).eq('id', user.id);
    
    document.getElementById('balance').innerText = newBalance.toFixed(4);
    pendingEl.innerText = "0.00000";
    
    alert("✅ تم الحفظ!");
    btn.innerText = "جمع الأرباح 📥";
    btn.disabled = false;
}

async function logoutUser() {
    await window.sb.auth.signOut();
    window.location.href = "index.html";
}

// بدء التشغيل
initMining();
