/* global axios */


const instance = axios.create({
    baseURL: "http://localhost:8000/api",
  });
  
async function main() {
    setupEventListeners();
  }
  
// 設定EventListeners，裡面包含Sign up按鈕function
function setupEventListeners() {
    
    const loginButton = document.querySelector("#LoginButton");
    
    //點擊Login按鈕
    loginButton.addEventListener("click", handleLogin);

    //按Enter
    document.addEventListener("keydown", (event) => {
      // Check if the pressed key is Enter (key code 13)
      if (event.key === "Enter") {
        handleLogin(event);
        
      }
    });

    
  }

const handleLogin = async (event) => {   
    // Prevent the default form submission behavior
    event.preventDefault();

    const emailInput = document.querySelector("#id");
    const passwordInput = document.querySelector("#password");
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email && !password) {
      Swal.fire({
        icon: 'warning',
        title: "Please enter an email and a password!",
        showConfirmButton: true,
      });
      return;
    }
    

    if (!email) {
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: "Please enter an email!",
        showConfirmButton: true,
      });
      return;
    }
    
    if (!password){
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: "Please enter a password!",
        showConfirmButton: true,
      });
      return;
    }
      
    try {
      const memberData = await getMembers({email, password});
      if (!memberData || memberData.length === 0){
        // 未找到會員警告
        Swal.fire({
          icon: 'error', // Set the icon (success, error, warning, info, question)
          title: 'Email or Password wrong！',
          showConfirmButton: true
          // timer: 3000
        });
        emailInput.value = "";
        passwordInput.value = "";
        return;
      }
    

    } catch (error) {
      Swal.fire({
        icon: 'error', // Set the icon (success, error, warning, info, question)
        title: "Failed to get member!",
        showConfirmButton: true
        // timer: 3000
      });
      return;
    }

    // 確定正確就清空
    
    Swal.fire({
      icon: 'success', // Set the icon (success, error, warning, info, question)
      title: 'Log in Successfully！',
      showConfirmButton: false,
      timer: 1500
    }).then( () => {
        storeAndNavigate(event);
        emailInput.value = "";
        passwordInput.value = "";
    });

};


function storeAndNavigate(event) {
  // 使用try規避掉enter的event.preventDefault();會錯誤的情況
  try{
    event.preventDefault();
  } finally {
    const emailInput = document.querySelector("#id");
    const id = emailInput.value;

    console.log('ID:', id);
    localStorage.setItem('ID', id);
    window.location.href = 'homepage.html';
  };
}

  // 前端呼叫後端function
async function getMembers(members) {
    const response = await instance.get("/members", {
      params: members
    });
    return response.data;
}
  
  // async function createMember(members) {
  //   const response = await instance.post("/members", members);
  //   return response.data;
  // }
  

main();
  