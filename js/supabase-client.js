(function () {
  try {
    var URL = window.GOKUYOU_CONFIG.SUPABASE_URL;
    var KEY = window.GOKUYOU_CONFIG.SUPABASE_KEY;

    window.supabaseClient = supabase.createClient(URL, KEY);

    window.gAuth = {
      signIn: function (email) {
        return window.supabaseClient.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: 'https://gokuyou-official.github.io/gokuyou/pages/auth-callback.html'
          }
        });
      },
      signOut: async function () {
        try {
          await window.supabaseClient.auth.signOut();
        } catch (e) {
          console.error(e);
        }
        window.location.href = '/gokuyou/pages/login.html';
      },
      getSession: async function () {
        var result = await window.supabaseClient.auth.getSession();
        return result.data.session;
      }
    };

    document.addEventListener('DOMContentLoaded', function () {
      try {
        var navLink = document.getElementById('nav-auth-link');
        if (!navLink) return;
        window.supabaseClient.auth.getSession().then(function (result) {
          var session = result && result.data ? result.data.session : null;
          if (session) {
            navLink.innerHTML = '<a href="/gokuyou/pages/profile.html">マイページ</a>';
          } else {
            navLink.innerHTML = '<a href="/gokuyou/pages/login.html">ログイン</a>';
          }
        }).catch(function (e) {
          console.error(e);
        });
      } catch (e) {
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
  }
})();
