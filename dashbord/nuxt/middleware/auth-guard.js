export default async function({$auth, redirect, store, $axios}) { 

  $axios.interceptors.request.use(config => {
    config.headers.Authorization = 'Bearer '+ $auth.getToken('local');
    return config;
  });

  $axios.onError(error => {
    console.log('auth error', error);
    if(error.response&&error.response.status === 401) {
      
      redirect('/login')
    }
  })

  if(!$auth.loggedIn){
    redirect('/login')
  } 
  else {
    console.log('All good');
    
  }
}