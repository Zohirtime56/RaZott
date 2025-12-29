// ملف: js/config.js
// هذا الملف مسؤول فقط عن الاتصال بـ Supabase

console.log("1. Config script started...");

// 1. البيانات (مكتوبة وجاهزة لكي لا تحدث أخطاء نسخ)
const RAW_URL = "https://oezehdkfucwhttsrocsv.supabase.co";
const RAW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lemVoZGtmdWN3aHR0c3JvY3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Mzg4OTMsImV4cCI6MjA4MjUxNDg5M30.WB567kJLDTTWJMpkw8QLq3Y1DL0serVz6-v95TJubKo";

// 2. دالة التنظيف الصارمة (تحذف أي شيء غريب)
function clean(str) {
    return str.replace(/[^a-zA-Z0-9._-]/g, "").trim();
}

const SUPABASE_URL = clean(RAW_URL);
const SUPABASE_KEY = clean(RAW_KEY);

// 3. متغير عام ليراه الجميع
window.sb = null; 

// 4. محاولة الاتصال
try {
    if (window.supabase) {
        window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ Supabase Connected Successfully!");
    } else {
        console.error("❌ Supabase library not loaded yet.");
    }
} catch (err) {
    console.error("🔥 Config Error: " + err.message);
    alert("خطأ في الاتصال: " + err.message);
}
