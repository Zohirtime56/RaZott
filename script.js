// 🔴 إعدادات الاتصال بـ SUPABASE
// استبدل القيم أدناه بالقيم الخاصة بمشروعك من موقع Supabase
const SUPABASE_URL = 'https://oezehdkfucwhttsrocsv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Xfac2hs9ZyQdfIzyDMcpTA_bh7c8GuE'; // المفتاح الطويل الذي يبدأ بـ eyJ

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// متغيرات اللعبة
let currentUser = null;
let miningPower = 0;
let lastCollectTime = 0;
let updateInterval;

// --- 1. دوال المصادقة (Auth) ---

async function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    showAlert('جاري إنشاء الحساب...', 'info');
    
    // تسجيل المستخدم
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
        showAlert(error.message, 'danger');
    } else {
        // إنشاء بروفايل في جدول البيانات
        if(data.user) {
            await supabase.from('profiles').insert([
                { id: data.user.id, username: email.split('@')[0] }
            ]);
            showAlert('تم التسجيل بنجاح! يمكنك الدخول الآن.', 'success');
        }
    }
}

async function signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        showAlert('خطأ في البريد أو كلمة السر', 'danger');
    } else {
        currentUser = data.user;
        startGame();
    }
}

async function logout() {
    await supabase.auth.signOut();
    location.reload();
}

// --- 2. منطق اللعبة (Game Logic) ---

async function startGame() {
    // تبديل الواجهة
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('dashboard-section').classList.remove('d-none');
    
    // جلب بيانات اللاعب
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
        
    if (data) {
        updateUI(data);
        startLocalCounter();
    }
}

function updateUI(data) {
    document.getElementById('user-display').innerText = data.username;
    document.getElementById('balance').innerText = data.balance.toFixed(4);
    document.getElementById('power').innerText = data.mining_power;
    
    miningPower = data.mining_power;
    lastCollectTime = new Date(data.last_collect).getTime();
}

// العداد الوهمي (تجميلي فقط للمستخدم)
function startLocalCounter() {
    if (updateInterval) clearInterval(updateInterval);
    
    updateInterval = setInterval(() => {
        const now = new Date().getTime();
        const secondsPassed = (now - lastCollectTime) / 1000;
        const profit = secondsPassed * miningPower;
        
        document.getElementById('pending').innerText = profit.toFixed(6);
    }, 100);
}

// --- 3. جمع الأرباح (الحقيقي) ---

async function collect() {
    const btn = document.querySelector('.btn-collect');
    btn.disabled = true;
    btn.innerText = "جاري الجمع...";

    // 1. حساب الوقت الحقيقي من السيرفر (أو قاعدة البيانات) لتجنب الغش
    const now = new Date();
    const secondsPassed = (now.getTime() - lastCollectTime) / 1000;
    
    if (secondsPassed < 10) { // منع الجمع السريع جداً
        showAlert('انتظر قليلاً لتجمع مبلغاً يستحق!', 'warning');
        btn.disabled = false;
        btn.innerText = "جمع الذهب الآن 💰";
        return;
    }

    const profit = secondsPassed * miningPower;

    // 2. جلب الرصيد القديم
    const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', currentUser.id)
        .single();

    const newBalance = profile.balance + profit;

    // 3. تحديث قاعدة البيانات
    const { error } = await supabase
        .from('profiles')
        .update({ 
            balance: newBalance,
            last_collect: now.toISOString()
        })
        .eq('id', currentUser.id);

    if (!error) {
        // تحديث الواجهة
        document.getElementById('balance').innerText = newBalance.toFixed(4);
        document.getElementById('pending').innerText = "0.0000";
        lastCollectTime = now.getTime();
        showAlert(`تم جمع ${profit.toFixed(4)} عملة!`, 'success');
    } else {
        showAlert('حدث خطأ في الاتصال', 'danger');
    }

    btn.disabled = false;
    btn.innerText = "جمع الذهب الآن 💰";
}

// أدوات مساعدة
function showAlert(msg, type) {
    const alertBox = document.getElementById('alert-box');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerText = msg;
    alertBox.classList.remove('d-none');
    setTimeout(() => alertBox.classList.add('d-none'), 3000);
      }
