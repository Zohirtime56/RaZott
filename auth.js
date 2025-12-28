// تأكد من وضع مفاتيحك هنا
const SUPABASE_URL = 'https://oezehdkfucwhttsrocsv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Xfac2hs9ZyQdfIzyDMcpTA_bh7c8GuE'; 

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('msg'); // تأكد أن لديك عنصر p بهذا الآيدي في HTML

    // 1. فحص الحقول
    if (!email || !password) {
        alert("الرجاء كتابة الإيميل وكلمة السر");
        return;
    }

    msg.innerText = "جاري الاتصال بالسيرفر...";

    try {
        // 2. محاولة التسجيل
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            alert("خطأ من Supabase: " + error.message); // سيظهر لك سبب المشكلة هنا
            msg.innerText = "فشل التسجيل";
        } else {
            // 3. التسجيل نجح، الآن ننشئ البروفايل
            alert("تم التسجيل! جاري إنشاء البروفايل...");
            
            if (data.user) {
                const { error: profileError } = await supabase.from('profiles').insert([
                    { id: data.user.id, username: email.split('@')[0] }
                ]);

                if (profileError) {
                    alert("مشكلة في الجدول: " + profileError.message);
                } else {
                    alert("🎉 تم كل شيء بنجاح! سيتم تحويلك.");
                    window.location.href = "index.html";
                }
            }
        }
    } catch (err) {
        alert("خطأ في الكود نفسه: " + err.message);
    }
}
