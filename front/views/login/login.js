const api = "http://localhost:3000/";


async function auths() {

    let formData = getFormData();


    let authorization = formData.name.toUpperCase() + ":" + formData.password;
    // console.log(authorization)
    let base64 = btoa(authorization);


    let headers = new Headers({
        authorization: "Basic" + base64,
    });


    let options = {
        headers: headers,
        method: 'GET',
        cache: "no-store"
    }

    let url = api + 'auth';
    const response = await fetch(url, options);
    const usuario = await response.json();

    if (usuario == null || usuario == "") {

        Swal.fire(
            'Error',
            'Login error: Name or password are incorrect',
            'error'
        )

    } else {

        setLogado(usuario);
        await Swal.fire(
            'Logado',
            'Login efetuado com sucesso',
            'success'
        );
        window.location.href = "./menu.html"
        // window.location.reload();
    }

    //Mostra os dados do usuario que etá logado
    // console.log(usuario);
}


function setLogado(usuario) {
    localStorage.setItem("logado", JSON.stringify(usuario));
    return true;
}


function getLogado() {
    // console.log(JSON.parse(localStorage.getItem('logado')))
    return JSON.parse(localStorage.getItem('logado'))
}


async function verify() {

    let logado = getLogado();

    //Mostra os dados do usuario que etá logado
    // console.log(logado)

    if (logado == null) {

        return
    }

    let authorization = logado.username + ":" + logado.password;
    let base64 = btoa(authorization);

    let headers = new Headers({
        authorization: "Basic" + base64
    });

    console.log("Headers")
    console.log(headers)

    let options = {
        headers: headers,
        method: 'GET',
        cache: "no-store"
    }

    console.log("Options")
    console.log(options)


    let url = api + 'verify';
    const response = await fetch(url, options);
    const usuario = await response.json();

    // if (usuario) {

    //     document.body.innerHTML = "Bem vindo, " + logado.nome;
    //     document.body.innerHTML += "<br/>";
    //     document.body.innerHTML += " <a href='./menu.html' onclick='out()'>aassssddfsasdsasd</a>";
    // }


}

//Exclui o COOKIE criado quando sair da página
// function out() {
//     localStorage.removeItem('logado');
// }


//Pega todos os dados do formulário do HTML
function getFormData() {
    let form = document.querySelector('form');
    let formData = new FormData(form);
    let dados = Object.fromEntries(formData)

    return dados;
}

verify();




// const Login = async () => {
//     const data = await getUsers();
//     const names = document.getElementById("name").value;
//     const name = names.toUpperCase();
//     const password = document.getElementById("password").value;


//     axios.post(`${api}/`, {
//         name: name,
//         password: password,
//         data: data.data,
//     })
//         .then((response) => {
//             window.location.href = "./menu.html"
//         }, () => {

//             Swal.fire(
//                 'Error',
//                 'Login error: Email or password are incorrect',
//                 'error'
//             )
//         });
// }

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
});

