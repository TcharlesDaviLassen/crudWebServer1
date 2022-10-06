const ENDPOINT = "http://localhost:3000";

const loadTable = (params) => {
    if (params) {
        loadTableData(params);
    } else {
        loadTableData('');
    }
};

const loadTableData = (params) => {
    axios.get(`${ENDPOINT}/categories${params}`)
        .then((response) => {

            if (response.status === 200) {
                const data = response.data;
                console.log(data)
                var trHTML = '';

                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.description + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showCategoryEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="categoryDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });

                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const categoryCreate = () => {

    const description = document.getElementById("description").value;

    axios.post(`${ENDPOINT}/categories`, {
        description: description,

    })
        .then((response) => {
            Swal.fire(`Categories ${response.data.description} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create categorie: ${error.response.data.error} `)
                .then(() => {
                    showCategoryCreateBox();
                })
        });
}

const getCategory = (id) => {
    return axios.get(`${ENDPOINT}/categories/` + id);
}

const categoryEdit = () => {
    const id = document.getElementById("id").value;
    const description = document.getElementById("description").value;

    axios.put(`${ENDPOINT}/categories/` + id, {
        description: description,
    })
        .then((response) => {
            Swal.fire(`Categories ${response.data.description} updated`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to update categorie: ${error.response.data.error} `)
                .then(() => {
                    showCategoryEditBox(id);
                })
        });
}


const categoryDelete = async (id) => {
    const category = await getCategory(id);
    const data = category.data;
    Swal.fire({
        title: 'Are you sure?',
        text: `You will not be able to reverse this if you delete ${data.description}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {

            const category = await getCategory(id);
            const data = category.data

            axios.delete(`${ENDPOINT}/categories/` + id)
                .then((response) => {
                    Swal.fire(
                        'Deleted!',
                        `category ${data.description} deleted`,
                        'success'
                    )
                    loadTable();
                }, (error) => {
                    Swal.fire(`Error to delete category: ${error.response.data.error} `);
                    loadTable();
                });
        };
    });
};



const showCategoryCreateBox = async () => {

    Swal.fire({
        title: 'Create category',
        html:
            '<input id="id" type="hidden">' +
            '<input id="description" class="swal2-input" placeholder="Name">',
        focusConfirm: false,
        showCancelButton: true,

        preConfirm: () => {
            categoryCreate();
        }
    });
}

const showCategoryEditBox = async (id) => {
    const category = await getCategory(id);
    // console.log(category)
    const data = category.data;
    Swal.fire({
        title: 'Edit category',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="description" class="swal2-input" placeholder="Name" value="' + data.description + '">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            categoryEdit();
        }
    });

}

function filterFunction() {
    const search = document.getElementById("myInput").value
    loadTable(`?description=${search}&sort=description&order=ASC`);
}


