// ملف: earn/script.js

// 1. رابط الجدار الخاص بك (الذي أرسلته لي)
const MY_OFFERWALL_LINK = "https://www.akamaicdn.org/list/28rfqX";

async function initOfferwall() {
    // التأكد من الاتصال
    if (!window.sb) {
        setTimeout(initOfferwall, 500);
        return;
    }

    const { data } = await window.sb.auth.getSession();
    if (!data.session) {
        window.location.href = "../index.html";
        return;
    }
    
    const user = data.session.user;
    document.getElementById('username-display').innerText = user.email;

    // 2. تجهيز الرابط الذكي
    // نضيف معرف المستخدم (ID) إلى الرابط لكي تعرف الشركة من نفذ العرض
    // CPALead تستخدم "subid" لاستلام معرف المستخدم
    const finalUrl = `${MY_OFFERWALL_LINK}?subid=${user.id}`;

    // 3. تشغيل الجدار
    const iframe = document.getElementById('offerwall-frame');
    iframe.src = finalUrl;
    
    // عند الانتهاء من التحميل، نُظهر الإطار ونخفي رسالة الانتظار
    iframe.onload = function() {
        document.getElementById('loading').style.display = 'none';
        iframe.style.display = 'block';
    };
}

// تشغيل
initOfferwall();
