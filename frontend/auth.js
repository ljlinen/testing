window.fbAsyncInit = function() {
  FB.init({
    appId            : '949226219483045',
    xfbml            : true,
    version          : 'v19.0'
  });
  
      // <!-- If you are logged in, automatically get your name and email adress, your public profile information -->
      const loginBtn = document.querySelector('#fb-auth-btn');
      
      loginBtn.addEventListener('click', () => {
        
      FB.login(function(response) {

          if (response.authResponse) {
               console.log('Welcome!  Fetching your information.... ');
              FB.api('/me', { fields: 'name, email' }, function (response) {
                   console.log(response.name);
                   //document.getElementById("profile").innerHTML = "Good to see you, " + response.name + ". i see your email address is " + response.email
               });
          } else { 
            //    <!-- If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email -->
               console.log('User cancelled login or did not fully authorize.'); }
});
        
      })
};