// إعدادات SUPABASE (ضع مفاتيحك هنا)
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY'; 

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة تسجيل الدخول
async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('msg');

    msg.innerText = "جاري التحقق...";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        msg.innerText = "خطأ: " + error.message;
    } else {
        // توجيه المستخدم لصفحة اللعبة
        window.location.href = "dashboard.html";
    }
}

// دالة إنشاء حساب
async function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('msg');

    msg.innerText = "جاري إنشاء الحساب...";

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        msg.innerText = error.message;
    } else {
        // إنشاء بيانات اللاعب في الجدول
        if (data.user) {
            await supabase.from('profiles').insert([
                { id: data.user.id, username: email.split('@')[0] }
            ]);
            alert("تم إنشاء الحساب بنجاح! سجل دخولك الآن.");
            window.location.href = "index.html";
        }
    }
}

// دالة الخروج
async function logout() {
    await supabase.auth.signOut();
    window.location.href = "index.html";
}

// التحقق من الجلسة (يوضع في صفحة الداشبورد)
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = "index.html"; // طرد المستخدم إذا لم يكن مسجلاً
    } else {
        return session.user;
    }
      }
