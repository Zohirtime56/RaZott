// ملف: withdraw/script.js

let userBalance = 0;
let currentUser = null;

// 1. تجهيز الصفحة عند الفتح
async function initWithdrawPage() {
    // التأكد من الاتصال (نستدعي المتغير من config.js)
    if (!window.sb) {
        setTimeout(initWithdrawPage, 500);
        return;
    }

    const { data } = await window.sb.auth.getSession();
    if (!data.session) {
        window.location.href = "../index.html";
        return;
    }

    currentUser = data.session.user;
    
    // جلب الرصيد
    const { data: profile } = await window.sb.from('profiles').select('balance').eq('id', currentUser.id).single();
    
    if (profile) {
        userBalance = profile.balance;
        document.getElementById('current-balance').innerText = userBalance.toFixed(4);
        // معادلة النقاط: 1 دولار = 1000 نقطة
        document.getElementById('points-balance').innerText = Math.floor(userBalance * 1000);
    }
}

// 2. دالة حساب الرسوم (تلقائية)
function calcFee() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const method = document.getElementById('method').value;
    
    let feePercent = 0;
    
    if (method === 'TRON') feePercent = 0.03; // 3%
    if (method === 'USDT') feePercent = 0.05; // 5%

    const fee = amount * feePercent;
    const final = amount - fee;

    document.getElementById('fee-val').innerText = fee.toFixed(3);
    document.getElementById('final-val').innerText = (final > 0 ? final : 0).toFixed(3);
}

// 3. تنفيذ طلب السحب
async function requestWithdraw() {
    const amount = parseFloat(document.getElementById('amount').value);
    const wallet = document.getElementById('wallet').value;
    const method = document.getElementById('method').value;
    const btn = document.getElementById('withdrawBtn');

    // -- التحقق من الأخطاء --
    if (!amount || !wallet) return alert("املأ جميع البيانات!");
    if (amount > userBalance) return alert("رصيدك غير كافٍ!");

    // الشروط الخاصة (الحد الأدنى)
    if (method === 'TRON' && amount < 1) return alert("الحد الأدنى لسحب Tron هو 1$");
    if (method === 'USDT' && amount < 5) return alert("الحد الأدنى لسحب USDT هو 5$");

    // -- التنفيذ --
    btn.innerText = "جاري المعالجة...";
    btn.disabled = true;

    try {
        // حساب القيم النهائية
        let feePercent = (method === 'TRON') ? 0.03 : 0.05;
        let fee = amount * feePercent;
        let finalAmount = amount - fee;

        // 1. تسجيل الطلب في جدول السحوبات
        const { error: withdrawError } = await window.sb.from('withdrawals').insert([{
            user_id: currentUser.id,
            method: method,
            address: wallet,
            amount: amount,
            fee: fee,
            final_amount: finalAmount,
            status: 'pending' // قيد الانتظار
        }]);

        if (withdrawError) throw withdrawError;

        // 2. خصم المبلغ من رصيد المستخدم
        const newBalance = userBalance - amount;
        const { error: updateError } = await window.sb.from('profiles')
            .update({ balance: newBalance })
            .eq('id', currentUser.id);

        if (updateError) throw updateError;

        // نجاح!
        alert("✅ تم إرسال طلب السحب بنجاح! سيتم المراجعة قريباً.");
        window.location.href = "../dashboard.html"; // العودة للرئيسية

    } catch (err) {
        alert("خطأ: " + err.message);
        btn.innerText = "تأكيد السحب ✔️";
        btn.disabled = false;
    }
}

// تشغيل الصفحة
initWithdrawPage();
