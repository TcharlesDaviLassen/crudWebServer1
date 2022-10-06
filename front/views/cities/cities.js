const ENDPOINT = "http://localhost:3000";

const loadTable = (params) => {
    if (params) {
        loadTableData(params);
    } else {
        loadTableData('');
    }
};


const loadTableData = (params) => {
    axios.get(`${ENDPOINT}/cities${params}`)
        .then((response) => {

            if (response.status === 200) {
                const data = response.data;
                console.log(data)
                var trHTML = '';

                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.cep + '</td>';
                    trHTML += '<td>' + element.State.province + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showCitieEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="citieDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });

                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const citieCreate = () => {

    const name = document.getElementById("name").value;
    const cep = document.getElementById("cep").value;
    const StateId = document.getElementById("mySelect").value;

    axios.post(`${ENDPOINT}/cities`, {
        name: name,
        cep: cep,
        StateId: StateId,
    })
        .then((response) => {

            Swal.fire(`cities ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create cities: ${error.response.data.error} `)
                .then(() => {
                    showCitieCreateBox();
                })
        });
}

const getCitie = (id) => {
    return axios.get(`${ENDPOINT}/cities/` + id);
}

const citieEdit = () => {
    const id = document.getElementById("id").value;
    const cep = document.getElementById("cep").value;
    const name = document.getElementById("name").value;

    const StateId = document.getElementById("mySelect").value;

    console.log(StateId)

    axios.put(`${ENDPOINT}/cities/` + id, {
        name: name,
        cep: cep,
        StateId: StateId,
    })
        .then((response) => {
            console.log(response.data)
            Swal.fire(`Citie ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update citie: ${error.response.data.error} `)
                .then(() => {
                    showCitieEditBox(id);
                })
        });
}


const citieDelete = async (id) => {
    const cities = await getCitie(id);
    const data = cities.data;
    Swal.fire({
        title: 'Are you sure?',
        text: `You will not be able to reverse this if you delete ${data.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            axios.delete(`${ENDPOINT}/cities/` + id)
                .then((response) => {
                    Swal.fire(
                        'Deleted!',
                        `City ${data.name} deleted`,
                        'success'
                    )
                    loadTable();
                }, (error) => {
                    Swal.fire(`Error to delete cities: ${error.response.data.error} `);
                    loadTable();
                });
        };
    });
};


const showCitieCreateBox = async () => {
    const comboBox = await createStateCombo();
    const states = await getStates();

    for (let i = 0; i < states.length; i++) {
        const state = states[i];
        optionHTML += '<option value="' + state.id + '">' + state.name + '</option>'
    }

    Swal.fire({
        title: 'Create City',
        html:
            '<input id="id" type="hidden">' +
            '<input type="text" name="cep" id="cep" class="swal2-input" placeholder="Postal Code" maxlength="8" onFocus="clearCEP()" OnBlur="validateCEP();"/>' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            comboBox,
        focusConfirm: false,
        showCancelButton: true,

        preConfirm: () => {
            citieCreate();
        }
    });
}

const showCitieEditBox = async (id) => {
    const cities = await getCitie(id);
    const data = cities.data;
    const stateCombo = await createStateCombo(data.StateId);
    
    Swal.fire({
        title: 'Edit City',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input type="text" name="cep" id="cep" class="swal2-input" placeholder="Postal Code" maxlength="8" onFocus="clearCEP()" OnBlur="validateCEP()" value="' + data.cep + '"/>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            stateCombo,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            citieEdit();
        }
    });

}

const createStateCombo = async (id) => {
    const states = await getStates();
    const data = states.data;
    var select = '<select class="swal2-input" id="mySelect">';

    select += `<option style="font-weight: bold;" > Selecione o estado </option>`
    data.forEach((element) => {
        if (id === element.id) {
            select += `<option value="${element.id}" selected>${element.name}</option>`;
        } else {
            select += `<option value="${element.id}">${element.name}</option>`;
        }
    });
    select += '</select>';
    return select;
}

const getStates = () => {
    return axios.get(`${ENDPOINT}/states`);
}

const validateCEP = async () => {
    let ao_cep = document.getElementById("cep").value;
    let cepValido = /^(([0-9]{5}-[0-9]{3}))$/;
    if (!cepValido.test(ao_cep)) {
        ao_cep = ao_cep.replace(/\D/g, ""); //Remove tudo o que não é dígito
        if (ao_cep.length === 8) {
            const cepsValidos = await axios.get(`https://viacep.com.br/ws/${ao_cep}/json/`);
            document.getElementById("name").value = cepsValidos.data.localidade;
            ao_cep = ao_cep.replace(/(\d{5})(\d)/, "$1-$2");
            document.getElementById("cep").value = ao_cep;
        }
    }
}

const clearCEP = () => {
    let ao_cep = document.getElementById("cep").value;
    let cepValido = /^(([0-9]{5}-[0-9]{3}))$/;
    if (cepValido.test(ao_cep)) {
        ao_cep = ao_cep.replace(/\D/g, "");
        const dado = document.getElementById("cep").value = ao_cep;
        console.log(dado)
    } else {
        document.getElementById("cep").value = '';
    }
}

function filterFunction() {
    const search = document.getElementById("myInput").value
    loadTable(`?name=${search}&sort=name&order=ASC`);
}
