// ملف: js/config.js
console.log("--> Config loading...");

// 1. رابط الموقع (مكتوب كأرقام لمنع حذف الرموز المهمة مثل // و :)
// يترجم هذا إلى: https://oezehdkfucwhttsrocsv.supabase.co
const _urlBytes = [104, 116, 116, 112, 115, 58, 47, 47, 111, 101, 122, 101, 104, 100, 107, 102, 117, 99, 119, 104, 116, 116, 115, 114, 111, 99, 115, 118, 46, 115, 117, 112, 97, 98, 97, 115, 101, 46, 99, 111];
const SUPABASE_URL = String.fromCharCode(..._urlBytes);

// 2. المفتاح (نص عادي لكن سنحميه من المسافات فقط)
const RAW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lemVoZGtmdWN3aHR0c3JvY3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Mzg4OTMsImV4cCI6MjA4MjUxNDg5M30.WB567kJLDTTWJMpkw8QLq3Y1DL0serVz6-v95TJubKo";
// نحذف المسافات فقط ونبقي النقاط والرموز
const SUPABASE_KEY = RAW_KEY.replace(/\s/g, '').trim();

// 3. تعريف المتغير العام
window.sb = null; 

// 4. الاتصال
if (window.supabase) {
    try {
        window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ Config: Connected to " + SUPABASE_URL);
    } catch (err) {
        console.error("❌ Config connection error: " + err.message);
        alert("خطأ في إعدادات الاتصال: " + err.message);
    }
} else {
    console.error("⚠️ Supabase library missing in config.");
}
