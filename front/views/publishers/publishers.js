const ENDPOINT = "http://localhost:3000";

const loadTable = () => {
    axios.get(`${ENDPOINT}/publishers`)
        .then((response) => {

            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';

                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.name + '</td>';
                    trHTML += '<td>' + element.City.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showPublisherEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="publisherDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });

                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const publisherCreate = () => {
    const name = document.getElementById("name").value;
    const id = document.getElementById("mySelect").value;

    // console.log(name)

    axios.post(`${ENDPOINT}/publishers`, {
        name: name,
        CityId: id,

    })
        .then((response) => {
            Swal.fire(`publishers ${response.data.name} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create publishers: ${error.response.data.error} `)
                .then(() => {
                    showPublisherCreateBox();
                })
        });
}

const getPublisher = (id) => {
    return axios.get(`${ENDPOINT}/publishers/` + id);
}

const userEdit = () => {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const ids = document.getElementById("mySelect").value;

    axios.put(`${ENDPOINT}/publishers/` + id, {
        name: name,
        CityId: ids,
    })
        .then((response) => {
            Swal.fire(`publishers ${response.data.name} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update publishers: ${error.response.data.error} `)
                .then(() => {
                    showPublisherEditBox(id);
                })
        });
}


const publisherDelete = async (id) => {
    const publisher = await getPublisher(id);
    const data = publisher.data;
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

            const publisher = await getPublisher(id);
            const data = publisher.data

            axios.delete(`${ENDPOINT}/publishers/` + id)
                .then((response) => {
                    Swal.fire(
                        'Deleted!',
                        `publisher ${data.name} deleted`,
                        'success'
                    )
                    loadTable();
                }, (error) => {
                    Swal.fire(`Error to delete publisher: ${error.response.data.error} `);
                    loadTable();
                });
        };
    });
};


const showPublisherCreateBox = async () => {
    const comboBox = await createCitiesCombo();
    Swal.fire({
        title: 'Create publishers',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Name">' +
            comboBox,
        focusConfirm: false,
        showCancelButton: true,

        preConfirm: () => {
            publisherCreate();
        }
    });
}

const showPublisherEditBox = async (id) => {
    const city = await getPublisher(id);
    const data = city.data;
    const comboBox = await createCitiesCombo(data.CityId);
    Swal.fire({
        title: 'Edit publishers',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="name" class="swal2-input" placeholder="Name" value="' + data.name + '">' +
            comboBox,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            userEdit();
        }
    });

}

const createCitiesCombo = async (id) => {
    const states = await getCities();
    const data = states.data;
    // console.log(data)
    var select = '<select class="swal2-inputs" id="mySelect">'

    select += `<option style="font-weight: bold;"> Selecione a cidade </option>`
    data.forEach(element => {
        if (id === element.id) {
            select += `<option value="${element.id}" selected>${element.name}</option>`;
        } else {
            select += `<option value="${element.id}">${element.name}</option>`;
        }
    });
    select += '</select>'
    return select;
}

const getCities = () => {
    return axios.get(`${ENDPOINT}/cities`);
}




