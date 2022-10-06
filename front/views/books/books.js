const ENDPOINT = "http://localhost:3000";

const loadTable = (params) => {
    if (params) {
        loadTableData(params);
    } else {
        loadTableData('');
    }
}


const loadTableData = (params) => {
    axios.get(`${ENDPOINT}/books${params}`)
        .then((response) => {

            if (response.status === 200) {
                const data = response.data;
                var trHTML = '';

                data.forEach(element => {
                    trHTML += '<tr>';
                    trHTML += '<td>' + element.id + '</td>';
                    trHTML += '<td>' + element.title + '</td>';
                    trHTML += '<td>' + element.author + '</td>'; bookCreate
                    trHTML += '<td>' + element.publication_year + '</td>';
                    trHTML += '<td>' + element.page + '</td>';
                    trHTML += '<td>' + element.coin + '</td>';
                    trHTML += '<td>' + element.value + '</td>';
                    trHTML += '<td>' + element.Format.description + '</td>';
                    trHTML += '<td>' + element.Category.description + '</td>';
                    trHTML += '<td>' + element.Publisher.name + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showBookEditBox(' + element.id + ')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="boockDelete(' + element.id + ')">Del</button></td>';
                    trHTML += "</tr>";
                });

                document.getElementById("mytable").innerHTML = trHTML;
            }
        })
};

loadTable();

const bookCreate = () => {

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication = document.getElementById("publication_year").value;
    const coins = document.getElementById("coin").value;
    const coin = coins.toUpperCase();
    const pages = document.getElementById("page").value;

    const PublisherId = document.getElementById("mySelectPublisherId").value;
    const CategoryId = document.getElementById("mySelectCategoryId").value;
    const FormatId = document.getElementById("mySelectFormatId").value;
    const value = document.getElementById("value").value;


    axios.post(`${ENDPOINT}/books`, {
        title: title,
        author: author,
        publication_year: publication,
        page: pages,
        coin: coin,
        value: value,

        PublisherId: PublisherId,
        CategoryId: CategoryId,
        FormatId: FormatId,
    })
        .then((response) => {
            console.log(response.data)
            Swal.fire(`Books ${response.data.title} created`);
            loadTable();
        }, (error) => {
            Swal.fire(`Error to create book: ${error.response.data.error} `)
                .then(() => {
                    showBookCreateBox();
                })
        });
}

const getBooks = (id) => {
    return axios.get(`${ENDPOINT}/books/` + id);
}

const BookEdit = () => {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publication_year = document.getElementById("publication_year").value;
    const page = document.getElementById("page").value;
    const coins = document.getElementById("coin").value;
    const coin = coins.toUpperCase();
    const value = document.getElementById("value").value;


    const PublisherId = document.getElementById("mySelectPublisherId").value;
    const CategoryId = document.getElementById("mySelectCategoryId").value;
    const FormatId = document.getElementById("mySelectFormatId").value;

    console.log(CategoryId);
    console.log(PublisherId);

    axios.put(`${ENDPOINT}/books/` + id, {
        title: title,
        author: author,
        publication_year: publication_year,
        page: page,
        coin: coin,
        value: value,

        PublisherId: PublisherId,
        CategoryId: CategoryId,
        FormatId: FormatId,
    })
        .then((response) => {
            console.log(response.data)
            Swal.fire(`Book ${response.data.title} updated`);
            loadTable();
        }, (error) => {
            console.log(error.response.data)
            Swal.fire(`Error to update book: ${error.response.data.error}`)
                .then(() => {
                    showBookEditBox(id);
                })
        });
}



const boockDelete = async (id) => {
    const book = await getBooks(id)
    const data = book.data;
    Swal.fire({
        title: 'Are you sure?',
        text: `You will not be able to reverse this if you delete ${data.title}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: ' #d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {

            const book = await getBooks(id);
            const data = book.data

            axios.delete(`${ENDPOINT}/books/` + id)
                .then((response) => {
                    Swal.fire(
                        'Deleted!',
                        `book ${data.title} deleted`,
                        'success'
                    )
                    loadTable();
                }, (error) => {
                    Swal.fire(`Error to delete book: ${error.response.data.error} `);
                    loadTable();
                });
        };
    });
};



const showBookCreateBox = async () => {

    const categories = await createCategoriesCombo();
    const publishers = await createPublishersCombo();
    const format = await createFormatCombo();

    Swal.fire({
        title: 'Create book',
        html:
            '<input id="id" type="hidden">' +
            '<input id="title" class="swal2-input" placeholder="Title">' +
            '<input id="author" class="swal2-input" placeholder="Author">' +
            '<input id="publication_year" class="swal2-input" placeholder="Publication year">' +
            '<input id="page" class="swal2-input" placeholder="Pages">' +
            '<input id="coin" class="swal2-input" placeholder="Coin">' +
            '<input id="value" class="swal2-input" placeholder="Value R$">' +
            categories +
            publishers +
            format,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            bookCreate();
        }
    });
}

const showBookEditBox = async (id) => {
    const book = await getBooks(id);
    const data = book.data;

    const categories = await createCategoriesCombo(data.CategoryId);
    const publishers = await createPublishersCombo(data.PublisherId);
    const format = await createFormatCombo(data.FormatId);

    Swal.fire({
        title: 'Edit book',
        html:
            '<input id="id" type="hidden" value=' + data.id + '>' +
            '<input id="title" class="swal2-input" placeholder="Name" value="' + data.title + '">' +
            '<input id="author" class="swal2-input" placeholder="Age" value="' + data.author + '">' +
            '<input id="publication_year" class="swal2-input" placeholder="Sex" value="' + data.publication_year + '">' +
            '<input id="page" class="swal2-input" placeholder="Email" value="' + data.page + '">' +
            '<input id="coin" class="swal2-input" placeholder="Coin" value="' + data.coin + '">' +
            '<input id="value" class="swal2-input" placeholder="Value" value="' + data.value + '">' +
            categories +
            publishers +
            format,
        showCancelButton: true,
        preConfirm: () => {
            BookEdit();
        }
    });

}




const createPublishersCombo = async (id) => {
    const states = await getPublishers();
    const data = states.data;
    var select = '<select class="swal2-inputs" id="mySelectPublisherId">'

    select += `<option style="font-weight: bold;"> Publicadora </option>`
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

const getPublishers = () => {
    return axios.get(`${ENDPOINT}/publishers`);
}



const createCategoriesCombo = async (id) => {
    const states = await getCategories();
    const data = states.data;
    var select = '<select class="swal2-inputs" id="mySelectCategoryId">'

    select += `<option style="font-weight: bold;" > Categoria </option>`
    data.forEach(element => {
        if (id === element.id) {
            select += `<option value="${element.id}" selected>${element.description}</option>`;
        } else {
            select += `<option value="${element.id}">${element.description}</option>`;
        }
    });
    select += '</select>'
    return select;
}

const getCategories = () => {
    return axios.get(`${ENDPOINT}/categories`);
}



const createFormatCombo = async (id) => {
    const states = await getFormat();
    const data = states.data;
    var select = '<select class="swal2-inputs" id="mySelectFormatId">'

    select += `<option style="font-weight: bold;" > Formato </option>`
    data.forEach(element => {
        if (id === element.id) {
            select += `<option value="${element.id}" selected>${element.description}</option>`;
        } else {
            select += `<option value="${element.id}"> ${element.description} </option>`
        }

    });
    select += '</select>'
    return select;
}

const getFormat = () => {
    return axios.get(`${ENDPOINT}/format`);
}

function filterFunction() {
    const search = document.getElementById("myInput").value
    loadTable(`?title=${search}&sort=title&order=ASC`);
}
